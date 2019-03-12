const subjects = [
    { id: 1, desc: 'Portugues' },
    { id: 2, desc: 'Matematica' },
    { id: 3, desc: 'Geografia' },
    { id: 4, desc: 'Historia' }
];

const subitens = [
    {
        subject: 1,
        itens: [
            { id: 1, desc: 'Verbos transitivo direto e indireto' },
            { id: 2, desc: 'Verbo ou adjetivo' }
        ]
    },
    {
        subject: 2,
        itens: [
            { id: 1, desc: 'Primo ou nao primo' },
            { id: 2, desc: 'Par ou impar' }
        ]
    },
    {
        subject: 3,
        itens: [
            { id: 1, desc: 'Regioes do Brasil' }
        ]
    }
];

const words = [
    {
        subject: 1,
        subitem: 1,
        ammo: [
            { id: 1, desc: 'Verbo transitivo direto' },
            { id: 2, desc: 'Verbo transitivo indireto' }
        ],
        words: [
            { weakness: 1, desc: 'Comer'},
            { weakness: 1, desc: 'Pegar'},
            { weakness: 1, desc: 'Ler'},
            { weakness: 1, desc: 'Querer'},
            { weakness: 2, desc: 'Gostar'},
            { weakness: 2, desc: 'Lembrar'},
            { weakness: 2, desc: 'Responder'},
            { weakness: 2, desc: 'Acreditar'}
        ]
    },
    {
        subject: 3,
        subitem: 1,
        ammo: [
            { id: 1, desc: 'Norte' },
            { id: 2, desc: 'Nordeste' },
            { id: 3, desc: 'Sul' },
            { id: 4, desc: 'Sudeste' },
            { id: 5, desc: 'Centro-oeste' },
        ],
        words: [
            { weakness: 1, desc: 'Roraima' },
            { weakness: 1, desc: 'Amapa' },
            { weakness: 1, desc: 'Para' },
            { weakness: 2, desc: 'Ceara' },
            { weakness: 2, desc: 'Maranhao' },
            { weakness: 2, desc: 'Rio Grande do Norte' },
            { weakness: 3, desc: 'Parana' },
            { weakness: 3, desc: 'Rio Grande do Sul' },
            { weakness: 3, desc: 'Santa Catarina' },
            { weakness: 4, desc: 'Sao Paulo' },
            { weakness: 4, desc: 'Minas Gerais' },
            { weakness: 4, desc: 'Espirito Santo' },
            { weakness: 5, desc: 'Mato Grosso' },
            { weakness: 5, desc: 'Mato Grosso do Sul' },
            { weakness: 5, desc: 'Goias' }
        ]
    }
];

const getStorage = (data) => localStorage.getItem(data) || [];

const getStorageWords = () => getStorage('words');

const getStorageSubitens = () => getStorage('subitens');

const getStorageSubjects = () => getStorage('subjects');

export const getAllWords = () => words.concat(getStorageWords());

export const getSubitemWords = ({ subject, subitem }) => getAllWords().find(w => w.subject === subject && w.subitem === subitem);

export const getAllSubitens = () => subitens.concat(getStorageSubitens());

export const getSubjectSubitens = (subject) => getAllSubitens().find(s => s.subject === subject);

export const getSubjects = () => subjects.concat(getStorageSubjects());