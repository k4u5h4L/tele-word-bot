const wordConstructor = ({ word, meaning }) => {
    let res = `
    Word of the half day is:

Word:
${word}


Meaning:
${meaning}
`;

    return res;
};

module.exports = wordConstructor;
