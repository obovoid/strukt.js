var environment = typeof window !== "undefined" ? window :
                    typeof global !== "undefined" ? global :
                    typeof globalThis !== "undefined" ? globalThis :
                    null;

if (!environment) {
  throw new Error('No global environment found');
}

const f = {}

// Type-Registry
const typeRegistry = {};

function registerType(name, TypeClass) {
  if (typeof TypeClass !== 'function') {
    throw new TypeError('TypeClass must be a constructor function');
  }
  if (typeRegistry.hasOwnProperty(name)) {
    throw new Error(`Type "${name}" is already registered`);
  }
  typeRegistry[name] = TypeClass;
}

class Structure {
  constructor(definition) {
    if (typeof definition !== 'object' || definition === null) {
      throw new TypeError('Structure definition must be an object');
    }
    this.definition = definition;
  }

  validate(value) {
    if (Array.isArray(this.definition)) {
      if (!Array.isArray(value)) {
        throw new TypeError('Expected an array');
      }
      const itemType = this.definition[0];
      for (const item of value) {
        this.#validateItem(itemType, item);
      }
      return true
    } else if (typeof this.definition === 'object') {
      if (typeof value !== 'object' || value === null || Array.isArray(value)) {
        throw new TypeError('Expected an object');
      }
      for (let [key, expectedType] of Object.entries(this.definition)) {
        if (!(key in value)) {
          throw new TypeError(`Missing key "${key}" in object`);
        }
        const replacer = this.#validateItem(expectedType, value[key]);
        if (replacer !== undefined) {
          value[key] = replacer;
        }
      }
      return true
    } else {
      throw new Error('Invalid structure definition');
    }
  }

  #validateItem(expectedType, value) {
    if (expectedType instanceof Structure) {
      expectedType.validate(value);
      return;
    }

    if (typeof expectedType === 'object' && !Array.isArray(expectedType)) {
      this.#validateObject(expectedType, value);
      return;
    }

    const TypeClass = typeRegistry[expectedType];
    if (!TypeClass) {
      throw new TypeError(`Unknown type "${expectedType}"`);
    }
    if (value instanceof TypeClass) {
      return value.value
    }
    
    const instance = new TypeClass(value);
    if (typeof instance.validate === 'function') {
      instance.validate(value);
    }
  }

  #validateObject(expectedObject, value) {
    if (typeof expectedObject !== 'object' || expectedObject === null) {
      throw new TypeError('Expected an object for validation');
    }
    for (const [key, expectedType] of Object.entries(expectedObject)) {
      if (!(key in value)) {
        throw new TypeError(`Missing key "${key}" in object`);
      }
      this.#validateItem(expectedType, value[key]);
    }
  }
}

function registerFunction(funcToRegister, args) {
  if (typeof funcToRegister !== 'function') {
    throw new TypeError('First argument must be a function');
  }

  if (f.hasOwnProperty(funcToRegister.name)) {
    throw new Error(`Function "${funcToRegister.name}" is already registered`);
  }

  if (!Array.isArray(args)) {
    throw new TypeError('Second argument must be an array of argument type names');
  }

  args.forEach(argTypeName => {
    if (!typeRegistry[argTypeName] && typeof argTypeName === 'string') {
      throw new TypeError(`Unknown type: ${argTypeName}`);
    }
  });

  f[funcToRegister.name] = function(...values) {
    if (values.length !== args.length) {
      throw new TypeError(`Expected ${args.length} arguments, but got ${values.length}`);
    }
  
    const mappedValues = values.map((value, index) => {
      const argumentType = args[index];
      const ExpectedType = typeRegistry[argumentType];

      if (argumentType instanceof Structure) {
        argumentType.validate(value);
        return value;
      } else if (value instanceof ExpectedType) {
        return value.value;
      }

      try {
        const instance = new ExpectedType(value);
        return instance.value;
      } catch (err) {
        throw new Error(`Failed to convert value at index ${index} to type ${args[index]}: ${err.message}`);
      }
    });

    return funcToRegister.call(this, ...mappedValues);
  };
}

// registering multiple functions at once
function registerFunctions(functionList) {
  for (const [funcToRegister, args] of functionList) {
    registerFunction(funcToRegister, args);
  }
}

/**
 * Registers a function or a list of functions with their argument types.
 * 
 * @param {Function|Array} funcOrList - A single function to register or an array of [function, argument types] pairs.
 * @param {Array} args - Argument types array
 * @throws {TypeError} If the input is invalid or argument types are not recognized.
 */
function r(funcOrList, args) {
  if (Array.isArray(funcOrList)) {
    registerFunctions(funcOrList);
    return;
  }
  registerFunction(funcOrList, args);
}

// expose API to the global environment
environment.func = f;
environment.f = f;
environment.r = r;
environment.registerFunction = registerFunction;
environment.registerFunctions = registerFunctions;
environment.registerType = registerType;
environment.Structure = Structure;
environment.typeRegistry = typeRegistry;