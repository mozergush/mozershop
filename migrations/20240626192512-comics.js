module.exports = {
  async up(db, client) {
    return db.collection('comics').insertMany([
      {
        productId: 'price_1PelNBAiGi8ipnWRbdBCv6oP',
        collection: 'spidermops',
        price: 550,
        name: 'Spider Mops vol.1',
        description:
          'An ordinary pug, a strange dream, and the awakening of new powers. The beginning of a journey to incredible adventures.',
        pages: 70,
        year: 2021,
        images: ['/img/comics/sm1.webp'],
        isBestseller: true,
      },
      {
        productId: 'price_1PelO4AiGi8ipnWRPD2EvbzT',
        collection: 'spidermops',
        price: 300,
        name: 'Spider Mops vol.2',
        description:
          'Spider webs, a new look, and amazing abilities. The pug gains its strength.',
        pages: 50,
        year: 2022,
        images: ['/img/comics/sm2.webp'],
        isBestseller: false,
      },
      {
        productId: 'price_1PelOKAiGi8ipnWRIfDxOwSy',
        collection: 'spidermops',
        price: 666,
        name: 'Spider Mops vol.3',
        description:
          'A clash with a mysterious enemy. The Cat-Joker takes the stage.',
        pages: 65,
        year: 2023,
        images: ['/img/comics/sm3.webp'],
        isBestseller: true,
      },
      {
        productId: 'price_1PelP9AiGi8ipnWRvmbFRRTT',
        collection: 'spidermops',
        price: 600,
        name: 'Spider Mops vol.4',
        description:
          'Dark forces unite. The pug and a cosmic symbiote in an epic showdown.',
        pages: 80,
        year: 2024,
        images: ['/img/comics/sm4.webp'],
        isBestseller: false,
      },
      {
        productId: 'price_1PelPfAiGi8ipnWRNcpLNRUV',
        collection: 'punjrafee',
        price: 650,
        name: 'Punjrafee vol.1',
        description:
          'The tragic story of a punishing giraffe. Grief and revenge entwine in its soul.',
        pages: 80,
        year: 2021,
        images: ['/img/comics/pj1.webp'],
        isBestseller: true,
      },
      {
        productId: 'price_1PelPwAiGi8ipnWRh7UrMCBR',
        collection: 'punjrafee',
        price: 700,
        name: 'Punjrafee vol.2',
        description:
          'Paris, revenge, and relentless justice. The giraffe takes matters into its own hands.',
        pages: 120,
        year: 2022,
        images: ['/img/comics/pj2.webp'],
        isBestseller: false,
      },
      {
        productId: 'price_1PelQBAiGi8ipnWRsc9Fni8g',
        collection: 'punjrafee',
        price: 900,
        name: 'Punjrafee vol.3',
        description:
          'Beach, sunset, and philosophical reflections. Life after revenge.',
        pages: 140,
        year: 2024,
        images: ['/img/comics/pj3.webp'],
        isBestseller: true,
      },
      {
        productId: 'price_1PelQXAiGi8ipnWRzPBVW37H',
        collection: 'murmurjoke',
        price: 400,
        name: 'Murmur JOKE vol.1',
        description:
          'The dark past of the Cat-Joker. His path of evil is just beginning.',
        pages: 80,
        year: 2021,
        images: ['/img/comics/mm1.webp'],
        isBestseller: false,
      },
      {
        productId: 'price_1PelQpAiGi8ipnWRmAmiB4gt',
        collection: 'murmurjoke',
        price: 777,
        name: 'Murmur JOKE vol.2',
        description:
          'An epic showdown with the Spider Pug. Who will emerge victorious?',
        pages: 77,
        year: 2023,
        images: ['/img/comics/mm2.webp'],
        isBestseller: true,
      },
      {
        productId: 'price_1PelR2AiGi8ipnWRp6gAumR7',
        collection: 'superpony',
        price: 1000,
        name: 'Superpony vol.1',
        description:
          'A pony with Superman’s strength saves the world from hordes of zombies. A fun and dynamic adventure.',
        pages: 120,
        year: 2024,
        images: ['/img/comics/sp1.webp'],
        isBestseller: true,
      },
    ])
  },

  async down(db) {
    return db.collection('comics').deleteMany({})
  },
}
