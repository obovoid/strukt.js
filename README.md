# strukt-js

**strukt-js** is a lightweight runtime framework for type-safe function registration and validation in JavaScript.  
It allows you to create structured, validated functions that work seamlessly in both the browser and Node.js — with zero build tools required.

---

## 🚀 Features

- ✅ Type-safe function arguments with custom or built-in types
- ✅ Runtime validation of primitives, objects, arrays, and nested structures
- ✅ No `import`/`require` needed — works globally via `<script>`
- ✅ Useable in both browser and module environments

---

## 🔡 current version
### v1.0.0

## 🔧 Getting Started

### 📦 Option 1: Load via `<script>` (Browser)

```html
<!-- load the library -->
<script src="strukt.js"></script>
<!-- load the library-types -->
<script src="types.js"></script>
```
After loading, all APIs are globally available: func, r, Structure, setStrictMode(), etc.

### Option 2: Node.js (non-module)
```js
require('./strukt.js');
require('./types.js');
```

### 🌐 Global API

| Global                      | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `func` or `f`               | Function container — all registered functions live here |
| `r()`                       | Alias to register a single or multiple functions        |
| `registerFunction`          | Register a function with determinded arguments          |
| `registerFunctions`         | Register multiple functions with determinded arguments  |
| `Structure`                 | Used to define complex object or array types            |
| `registerType(name, Class)` | Define your own custom types                            |

### 📚 Example: Basic usage
```js
function greet(name) {
  console.log("Hello", name);
}

registerFunction(greet, ['String']);
// alias:
r(greet, ['String']);

func.greet("Anna");   // ✅ OK
func.greet(123);      // ❌ Throws
```

### 🔄 Use Classes for more readability (optional)
```js
func.multiply(new types.Float(0.5), new types.Double(3.3)); // ✅
func.multiply(0.5, 3);                                      // ✅
```

### 🧱 Structures
Use Structure to define typed objects
```js
const userStructure = new Structure({
  name: 'String',
  age: 'Int',
  isActive: 'Boolean'
});
```

you can also use nested Structures:
```js
const nested = new Structure({
  user: {
    info: {
      age: 'Int',
      tags: 'StringArray'
    }
  }
});
```

### 🔍 Function with structured argument
```js
// your function, no change needed.
function logUser(user) {
  console.log(`${user.name}, age ${user.age}`);
}

// Registers a function or a list of functions with their argument types
// @param {Function|Array}
// @param {Array[String|Structure]}
r(logUser, [userStructure]);

// Call a function in strict- or unstrict mode
func.logUser({
  name: new types.String("Ella"),
  age: 25, // primitive value
  isActive: new types.Boolean(true)
});
```

### 🧪 Full example with array structure
```js
function printIds(data) {
  console.log(data.ids.join(", "));
}

const structure = new Structure({
  ids: 'IntArray'
});

r(printIds, [structure]);
func.printIds({ ids: [1, 2, 3] });
```

### 🧠 Custom types
```js
class EvenInt {
  constructor(value) {
    if (!Number.isInteger(value) || value % 2 !== 0) {
      throw new TypeError(`Invalid Integer. ${value} is not even`);
    }
    this.value = value;
  }
}

registerType('EvenInt', EvenInt);
```

### 📜 License
MIT License

### 💬 Contributing
You're welcome to contribute custom types, helper tools, or improvements!
Just open an issue or create a pull request.
