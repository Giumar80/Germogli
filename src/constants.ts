import { Crop, Seed, Step } from './types';

export const ACTIVE_CROPS: Crop[] = [
  {
    id: '1',
    name: 'Germogli di Broccoli',
    phase: 'Germinazione',
    day: 3,
    progress: 45,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjvfo_tFqta49jowpwIdI2NFuDXRJusIgWk29Bjwf80R_e5x0KaLMfn30tsjHBAxiPYvjZc95YvxyREIwMb1LVhLy2Q4yQu1oZaM8M-mneFKwVmXh0ps9jD3Da-NR8tePoIozlupCjKMFJJdwm3uuUvXAfRn2Fo3-_osvHLa03kQdxPTo4kunM7kuQEiaZzjOM066mLQsPMTUJL4yy4G0xj69uPsPrfwCPHX4M33UBHTkaMjhwV0xGg7_WkNrkTnWKDrbbf1HhYQ',
  },
  {
    id: '2',
    name: 'Erba Medica (Alfalfa)',
    phase: 'Ammollo Iniziale',
    day: 1,
    progress: 15,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWhTJ3HBAGAEjSZdshP133mvF5FZEtaj_8kYtJGeGem0NYMBrM8dKleeaXJKTb_EX2UTfY0FQ1zgA627YHdwr-OVl2Pxd6w5AgmrNr6OyJAJwoGhlpkmrVFHCVeX0lq0-i9udRwVpl0yMq8NvsOr7sriovaovQJ6yjYwMC05Jv5n0yCcxx39HvviP2n4AeoMoj190Ee_dDwUrPYVatgrkGeFQPanmnqov7r0rJhlN4qqY6GDHxiy0Zy3iktOkTzIu4RQwaOHjNrA',
  }
];

export const LEGUME_CROPS: Crop[] = [
  {
    id: '3',
    name: 'Germogli di Lenticchie',
    phase: 'Crescita',
    day: 3,
    progress: 65,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArMxJ4S32T06XbwNV3ZahX0JbmHM2rlDZZuc9aZqIuMakhHh8_uF3ZDQJDkXcaCCRQLidIZLBM8FRXHzlZbV5je7RFwh_iBLM6jYlegNwPPLrI0eLgR_gBxGao3btYm5P7qXhyu1NxW9TAL57yv9nQI7Lxhy80nM9KTMKirjO9CBN82DAB8JD61P3WUd4i6ObthLQE9wIZnnNq4XGJWP9d_Qcd72e-s5SVjqNuL34rObHIWOZKTkl_IlxucsIk1TJGaLu-4cFelw',
    stats: { temp: '22°C', watering: '2 risciacqui / dì' }
  },
  {
    id: '4',
    name: 'Germogli di Ceci',
    phase: 'Ammollo',
    day: 0,
    progress: 85,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzAHkiNj4UMDV5GH_iXK5NlyTXgnPCouaFVVzICwsq0FbBnM9_LTblCXk0NVYNAzyzodVqdoTFU5YbyRL7lHjYUk1l9E4RB1cS8MsSc6gh6-O2DdgrpSUcOuuGRS5vceR9w9GqcIOEugrBdUTGA9rboen_O2WKsecxKj4EwYDT9YM8RtWO_kIhafnW7A8-iV4z5bQYnmWK6pCi2KjbjQX6mwb4F9BsGm9OGLeJhvifVt1cLDYTwgnNEZfFPL-QQ3l94W3PJ9DA_A',
    stats: { temp: '20°C', watering: '1 risciacquo / dì' }
  }
];

export const SEEDS: Seed[] = [
  {
    id: 'lentils',
    name: 'Lenticchie',
    description: 'Sapore di terra con una consistenza soda. Perfette per aumentare l\'apporto di fibre.',
    time: '3-5 giorni',
    difficulty: 'Medio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIT_z_Y0oJsC_xfwQAvg7U9D0zf0Nxs3SjDkQjqG9pvsJTKrh8izv7OUzyHKTTG_oJg1QsOz01JuY9mtVOfFusT97GrnXbcOkMDwRMjWoy7zYadWCgz86_M1DV632Q7LYKHlpd9Wk3nAiKkEX0HUSXyPRF-esUBqi3Kr-nB8DqcgKchi2NLeMQkgcAEGkoTNL6ybXMHTTe1Tzbbhb1w4uCSc10Hik4U31NcvjzlygUQHHWO95IeyZPriI-VYmOq-UQDzmqkF1Feg',
    badge: 'Fibre',
    badgeType: 'protein',
    cultivationModule: {
      instructions: ['Ammollo 8h', 'Risciacquo 2x/dì', 'Luce indiretta'],
      idealTemp: '18-22°C',
      wateringFreq: '2 volte al giorno',
      nutrients: ['Ferro', 'Proteine', 'Fibre'],
      harvestTips: 'Ottime quando il germoglio è della stessa lunghezza del seme.'
    }
  },
  {
    id: 'chickpeas',
    name: 'Ceci',
    description: 'Grandi, croccanti e dal sapore nocciolato. Una base proteica eccellente per piatti caldi.',
    time: '3-4 giorni',
    difficulty: 'Medio',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzAHkiNj4UMDV5GH_iXK5NlyTXgnPCouaFVVzICwsq0FbBnM9_LTblCXk0NVYNAzyzodVqdoTFU5YbyRL7lHjYUk1l9E4RB1cS8MsSc6gh6-O2DdgrpSUcOuuGRS5vceR9w9GqcIOEugrBdUTGA9rboen_O2WKsecxKj4EwYDT9YM8RtWO_kIhafnW7A8-iV4z5bQYnmWK6pCi2KjbjQX6mwb4F9BsGm9OGLeJhvifVt1cLDYTwgnNEZfFPL-QQ3l94W3PJ9DA_A',
    badge: 'Proteico',
    badgeType: 'protein',
    cultivationModule: {
      instructions: ['Ammollo 12-24h', 'Risciacquo 2-3x/dì', 'Mantenere al buio'],
      idealTemp: '20-24°C',
      wateringFreq: '3 volte al giorno',
      nutrients: ['Proteine', 'Zinco', 'Magnesio'],
      harvestTips: 'Raccogli appena spunta il germoglio per la massima digeribilità.'
    }
  }
];

export const GUIDE_STEPS: Step[] = [
  {
    id: 1,
    title: 'Fase di Idratazione',
    label: 'PREPARAZIONE DEI SEMI',
    description: 'Metti a bagno i semi per risvegliare gli embrioni dormienti. Misura circa 30 ml (2 cucchiai rasi) di semi di broccoli e mettili in un barattolo a bocca larga. Copri con acqua filtrata e lasciali riposare in un luogo fresco e buio.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDilN1YwhoExtkpcULoz85BP3XiLpp7e6PnLsHYlKJsDwS4jOXtfla7QIpwPL0AURKJoujByfBcWr155F0vN-VNOiA7IESoGNPXo6kBw6U9_R7G3rpZBrJYgYInNb5ioiayIdmcjXaZrHBOQ9DuAzix6mmLyW8sCysbu3IqftrLU42WKm1G-71-12a-Ye0twxCwHQStMVH-jFemoOLhbdJQvy7LjXzQLKrBuJMcsMb5lbE31wCx4-LFLaW5gO-enVHL0BkyHOffQQ',
    checklist: [
      '30 ml (2 cucchiai) di semi di broccoli',
      'Acqua filtrata a temp. ambiente',
      'Barattolo o ciotola di vetro'
    ],
    duration: '12 Ore'
  }
];
