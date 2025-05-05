
function multiply(a, b) {
  console.log(`${a} * ${b} =`, a * b);
}

function addInt(int1, int2) {
  console.log(`${int1} + ${int2} =`, int1 + int2);
}

r([
  [multiply, ['Float', 'Double']],
  [addInt, ['Int', 'Int']]
]);

// Test
func.multiply(new types.Float(0.5), new types.Double(10)); // 5
func.addInt(new types.Int(3), new types.Int(4)); // 7