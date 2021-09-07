const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const seed = async () => {
    const res = await prisma.dictionary.create({
        data: {
            word: "aaaaaaaaaaaaaaaaaaaa",
            meaning: "testing",
        },
    });

    console.log("Finished");
    console.log(res);
};

seed();
