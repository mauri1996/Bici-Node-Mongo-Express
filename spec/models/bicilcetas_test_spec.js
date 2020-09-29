var Bicicleta = require('../../models/bicicleta');
// Hace esto antes de cada describe resetea la columna
beforeEach(()=>{Bicicleta.allBicis=[];});

describe('Bicicletaa.allBicis',()=>{
    it('comienza vacio',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add',()=>{
    it('Agregar 1 bici',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [-2.883349, -78.990207]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.finById',()=>{
    it('Debe devovler la bici con ID 1',()=>{

        expect(Bicicleta.allBicis.length).toBe(0);
        var a = new Bicicleta(1, 'rojo', 'urbana', [-2.883349, -78.990207]);
        var b = new Bicicleta(2, 'blanco', 'montaña', [-2.883349, -78.990207]);
        Bicicleta.add(a);
        Bicicleta.add(b);

        var biciBuscada = Bicicleta.findById(1);

        expect(biciBuscada.id).toBe(1);
        expect(biciBuscada.color).toBe(a.color);
        expect(biciBuscada.modelo).toBe(a.modelo);


    });
});


