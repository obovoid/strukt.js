
const userStructure = new Structure({
  name: 'String',
  age: 'Int',
  isActive: 'Boolean',
  tags: 'StringArray',
});

function greet(user) {
  console.log(`Hello ${user.name}, age ${user.age}, active: ${user.isActive}`);
}

r([
  [greet, [userStructure]]
]);

// Test
func.greet({
  name: new types.String('Anna'),
  age: new types.Int(30),
  isActive: new types.Boolean(true),
  tags: new types.StringArray(['admin', 'editor'])
});
