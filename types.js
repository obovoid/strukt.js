var environment = typeof window !== "undefined" ? window :
                    typeof global !== "undefined" ? global :
                    typeof globalThis !== "undefined" ? globalThis :
                    null;

const types = {
  Float: class {
    constructor(value) {
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new TypeError('Float must be between 0 and 1');
      }
      this.value = value;
    }
  },
  Double: class {
    constructor(value) {
      if (!Number.isFinite(value)) {
        throw new TypeError('Double must be a finite number');
      }
      this.value = value;
    }
  },
  Int: class {
    constructor(value) {
      if (!Number.isInteger(value)) {
        throw new TypeError('Int must be an integer');
      }
      this.value = value;
    }
  },
  Boolean: class {
    constructor(value) {
      const valid = typeof value === 'boolean' || value instanceof Boolean || value === 'true' || value === 'false'

      if (!valid) {
        throw new TypeError('Invalid Boolean value');
      }
      this.value = Boolean(value);
    }
  },
  String: class {
    constructor(value) {
      if (typeof value !== 'string' && !(value instanceof String)) {
        throw new TypeError('Expected a string');
      }
      this.value = value;
    }
  },
  IntArray: class extends Structure {
    constructor(value) {
      super(['Int']);
      if (!this.validate(value)) {
        throw new TypeError('Invalid IntArray');
      }
      this.value = value;
    }
  },
  StringArray: class extends Structure {
    constructor(value) {
      super(['String']);
      if (!this.validate(value)) {
        throw new TypeError('Invalid StringArray');
      }
      this.value = value;
    }
  },
};

// register types
for (const [name, TypeClass] of Object.entries(types)) {
  environment.registerType(name, TypeClass);
}

// expose types to the global environment
environment.types = types;