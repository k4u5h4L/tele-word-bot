const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const dict = require("../data/dictionary.json");

const prisma = new PrismaClient();

let words = [];

for (const key in dict) {
    const temp = { word: key, meaning: dict[key] };
    words.push(temp);
}

console.log("Pushing to DB...");
// console.log(words.length);

const seed = () => {
    // const res = await prisma.dictionary.createMany({
    //     data: words,
    // });

    // const [res, totalWords] = await prisma.$transaction([
    //     prisma.dictionary.createMany({ data: words }),
    //     prisma.dictionary.count(),
    // ]);

    words.forEach((obj, index) => {
        const temp = async () => {
            const res = await prisma.dictionary.create({
                data: obj,
            });
        };

        temp();

        console.log(`Executing: ${index}`);
    });

    console.log("Uploaded!");
};

// for (let i = 0; i < 10; i++) {
//     seed();
// }

// seed();

const makeNewJson = () => {
    fs.writeFile(
        "dictionaryCollection.json",
        JSON.stringify(words),
        function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("file saved!");
            }
        }
    );
};

makeNewJson();
