var environment = typeof window !== "undefined" ? window :
                    typeof global !== "undefined" ? global :
                    typeof globalThis !== "undefined" ? globalThis :
                    null;

const types = {
  Float: class {
    constructor(value) {
      if (!Number.isFinite(value) || value < 0 || value > 1) {
        throw new TypeError(`Invalid Float value: ${value}. Expected a finite number between 0 and 1.`);
      }
      this.value = value;
    }
  },
  Double: class {
    constructor(value) {
      if (!Number.isFinite(value)) {
        throw new TypeError(`Invalid Double value: ${value}. Expected a finite number.`);
      }
      this.value = value;
    }
  },
  Int: class {
    constructor(value) {
      if (!Number.isInteger(value)) {
        throw new TypeError(`Invalid Int value: ${value}. Expected an integer.`);
      }
      this.value = value;
    }
  },
  Boolean: class {
    constructor(value) {
      const valid = typeof value === 'boolean' || value instanceof Boolean || value === 'true' || value === 'false'

      if (!valid) {
        throw new TypeError(`Invalid Boolean value: ${value}. Expected a boolean or a string representation ('true' or 'false').`);
      }
      this.value = Boolean(value);
    }
  },
  String: class {
    constructor(value) {
      if (typeof value !== 'string' && !(value instanceof String)) {
        throw new TypeError(`Invalid String value: ${value}. Expected a string.`);
      }
      this.value = value;
    }
  },
  IntArray: class extends Structure {
    constructor(value) {
      super(['Int']);
      if (!this.validate(value)) {
        throw new TypeError(`Invalid IntArray: ${value}. Expected an array of integers.`);
      }
      this.value = value;
    }
  },
  StringArray: class extends Structure {
    constructor(value) {
      super(['String']);
      if (!this.validate(value)) {
        throw new TypeError(`Invalid StringArray: ${value}. Expected an array of strings.`);
      }
      this.value = value;
    }
  },
  Date: class {
    constructor(value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new TypeError(`Invalid Date value: ${value}. Expected a valid date string or timestamp.`);
      }
      this.value = date;
    }
  },
  UUID: class {
    constructor(value) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (typeof value !== 'string' || !uuidRegex.test(value)) {
        throw new TypeError(`Invalid UUID value: "${value}". Expected a valid UUID.`);
      }
      this.value = value;
    }
  },
  Range: class {
    // TODO: Think of a primitive way to define the range instead of insisting to use a class
    constructor(value, min, max) {
      if (typeof value !== 'number' || value < min || value > max) {
        throw new TypeError(`Invalid Range value: ${value}. Expected a number between ${min} and ${max}.`);
      }
      this.value = value;
    }
  }
};

// register types
for (const [name, TypeClass] of Object.entries(types)) {
  environment.registerType(name, TypeClass);
}

// expose types to the global environment
environment.types = types;