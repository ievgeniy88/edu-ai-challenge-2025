const { Enigma, Rotor } = require('./enigma');

describe('Rotor', () => {
  it('should step correctly', () => {
    const rotor = new Rotor('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'A');
    expect(rotor.position).toBe(0);
    rotor.step();
    expect(rotor.position).toBe(1);
  });
});

describe('Enigma Machine', () => {
  it('should encrypt a single character correctly', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    expect(enigma.process('A')).toBe('D');
  });

  it('should encrypt a full message correctly', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    expect(enigma.process('HELLOWORLD')).toBe('VNACADJZRA');
  });

  it('should handle plugboard swaps', () => {
    const plugboardPairs = [['A', 'B'], ['C', 'D']];
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], plugboardPairs);
    expect(enigma.process('HELLOWORLD')).toBe('VNBDBCJZRH');
  });

  it('should handle rotor stepping correctly (double step)', () => {
    // Rotor II (middle) has notch at 'E' (pos 4)
    // Rotor III (right) has notch at 'V' (pos 21)
    
    // Test case for double step:
    // Set rotor II to be at its notch, and rotor III one step before its notch.
    // rotor[0] is I, rotor[1] is II, rotor[2] is III
    const positions = [0, 4, 20]; // Left, Middle, Right. Middle is at notch.
    const enigma = new Enigma([0, 1, 2], positions, [0, 0, 0], []);
    
    // Before stepping: [0, 4, 20]
    enigma.stepRotors();
    // After 1st step: rotor III steps, is at notch.
    // rotor II was at notch, so it steps, and rotor I steps.
    // Final positions: [1, 5, 21]
    expect(enigma.rotors[0].position).toBe(1);
    expect(enigma.rotors[1].position).toBe(5);
    expect(enigma.rotors[2].position).toBe(21);
    
    // Before 2nd step: [1, 5, 21]
    enigma.stepRotors();
    // After 2nd step: rotor III was at notch, so rotor II steps.
    // Final positions: [1, 6, 22]
    expect(enigma.rotors[0].position).toBe(1);
    expect(enigma.rotors[1].position).toBe(6);
    expect(enigma.rotors[2].position).toBe(22);
  });

  it('should pass through non-alphabetic characters', () => {
    const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
    expect(enigma.process('HELLO WORLD!')).toBe('VNACA DJZRA!');
  });
});
