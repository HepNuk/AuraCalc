var aurasEncode = [
  [
    // add new things up here
    ['PRECISION', 5],
    ['CIRCLE', 7],
    ['REDUCED_MANA', 7],
    ['ENLIGHTEN', 4],
    ['BLOOD_GEM', 5],
    ['CLARITY', 5],
    ['VITALITY', 5],
    ['MULTIPLIER', 10]
  ],
  [
    // add new things up here
    ['AWAKENED_BLASPHEMY', 3],
    ['BLASPHEMY', 3],
    ['SKITTERBOTS', 1],
    ['PRIDE', 1],
    ['FLESH_AND_STONE', 1],
    ['MARCH_OF_LEGION', 1],
    ['MALEVOLENCE', 1],
    ['ZEALOTRY', 1],
    ['BLOOD_AND_SAND', 1],
    ['DREAD_BANNER', 1],
    ['WAR_BANNER', 1],
    ['THE_DEVOURING_DIADEM', 1],
    ['AULS_UPRISING', 1],
    ['HERALD_AGONY', 1],
    ['HERALD_PURITY', 1],
    ['PURITY_ELEMENTS', 1],
    ['THE_COVENANT', 1],
    ['ENVY', 1],
    ['HERETICS_VEIL', 1],
    ['ESSENCE_WORM', 1],
    ['ENHANCE', 1],
    ['VICTARIOS', 1],
  	['VIVINSECT', 1],
    //['GENEROSITY', 1],
    ['ASPECT', 1],
    ['MAIM', 1],
    ['EMPOWER', 1],
    ['PRISM_GUARDIAN', 1],
    ['SHIELD_TEN', 1],
  	['SHIELD_FIF', 1],
    ['WRATH', 1],
    ['ARCTIC', 1],
    ['PURITY_LIGHTNING', 1],
    ['PURITY_ICE', 1],
    ['PURITY_FIRE', 1],
    ['PURITY_ELEMENTS', 1],
    ['HERALD_THUNDER', 1],
    ['HERALD_ICE', 1],
    ['HERALD_ASH', 1],
    ['HATRED', 1],
    ['HASTE', 1],
    ['GRACE', 1],
    ['DISCIPLINE', 1],
    ['DETERMINATION', 1],
    ['ANGER', 1]
  ]
]

var settingsEncode = [
  // add new things up here
  [
    ['DISCORD_ARTISAN', 1],
    ['HERALD_RMR2', 1],
    ['HERALD_RMR', 1],
	  ['EGO', 1],
	  ['INPIRATIONAL', 1],
	  ['MASK_TRIBUNAL', 1],
	  ['HYRRI', 1],
	  ['SAQAWALS_NEST', 1],
	  ['MASTERMIND_DISCORD', 1],
	  ['MEMORY_VAULT', 1],
	  ['IMPRESENCE', 1],
	  ['CALAMITY', 1],
	  ['SANCTUARY_OF_THOUGHT', 1],
	  ['PERFECT_FORM', 1],
	  ['CONQUERORS', 1],
	  ['ICHIMONJI2', 1],
	  ['ICHIMONJI', 1],
	  ['MIDNIGHT_BARGAIN2', 1],
	  ['MIDNIGHT_BARGAIN', 1],
	  ['ALPHAS_HOWL', 1],
	  ['RARE_RMR', 1],
	  ['RARE_DBL_RMR', 1],
	  ['MORTAL_CONVICTION', 1],
	  ['BLOOD_MAGIC', 1],
	  ['SKYFORTH', 1],
	  ['PURE_GUILE', 1],
	  ['PURE_MIGHT', 1],
	  ['PURE_APT', 1],
	  ['SUBLIME_FORM', 1],
	  ['UNCOMPROMISING', 1],
	  ['SELF_CONTROL', 1],
	  ['MASTER_COMMAND', 1]
  ],[
	  ['reducedMana', 7],
	  ['amuletRMR', 4],
	  ['jewelRMR', 5],
	  ['mana', 15],
	  ['life', 15]
  ]
]

var alpha = {
  // changing this index will break all previous links, so don't be a jerk
  index: 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ=_-',

  encode: function(encnum) {

    var ret = ''

    for (var i = Math.floor(Math.log(parseInt(encnum)) / Math.log(alpha.index.length)); i >= 0; i--) {
      ret = ret + alpha.index.substr((Math.floor(parseInt(encnum) / alpha.bcpow(alpha.index.length, i)) % alpha.index.length), 1)
    }

    return ret.reverse()
  },

  decode: function(decstr) {
    var str = decstr.reverse()
    var ret = 0

    for (var i = 0; i <= (str.length - 1); i++) {
      ret = ret + alpha.index.indexOf(str.substr(i, 1)) * (alpha.bcpow(alpha.index.length, (str.length - 1) - i))
    }

    return ret
  },

  bcpow: function(_a, _b) {
    return Math.floor(Math.pow(parseFloat(_a), parseInt(_b)))
  }
}
var pad = function(num, amount) {
  var zeros = new Array(amount + 1).join("0")
  return (zeros + "" + num).slice(amount * -1)
}
String.prototype.reverse = function() {
  return this.split("").reverse().join('')
}

var globalTmp = {}
/* http://www.pathofexile.com/forum/view-thread/567561/page/3 */
var calculateAura = function(aura, reducedMana = 0, lessMana = [], multiplier = 100) {
  var base = Math.floor(aura * (multiplier / 100))
  var reducedPercentage = ((100 - reducedMana) / 100)
  var lessPercentage = lessMana.reduce((x, v) => (x * ((100 - v) / 100)), 1)
  var total = reducedPercentage < 1 ? Math.ceil(base * reducedPercentage) : Math.floor(base * reducedPercentage)
  return Math.max(Math.floor(total * lessPercentage), 0)
}

var aspectCalc = function(pl){

  var localReducedMana = 0
  var localMultiMana = pl.localMutliplier

  if (pl.rootScope.itemGroup['ENLIGHTEN'][pl.auraGroup]){
    var number = parseInt(pl.rootScope.itemGroup['ENLIGHTEN'][pl.auraGroup])
    localMultiMana += 100-pl.rootScope.LOCAL_ITEMS['ENLIGHTEN'].multi[number]

  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, localReducedMana, pl.globalLessMana, localMultiMana)
}

//Heralds
var heraldCalc = function(pl) {
  if(pl.rootScope.settings['CALAMITY']) {
    return 45
  }

  var localReducedMana = pl.localReducedMana

  if (pl.rootScope.settings['MASTERMIND_DISCORD'] == true) {
    localReducedMana += pl.rootScope.ITEMS[0]['MASTERMIND_DISCORD'].reduced
  }
  if (pl.rootScope.settings['HERALD_RMR'] == true) {
    localReducedMana += pl.rootScope.ITEMS[0]['HERALD_RMR'].reduced
  }
  if (pl.rootScope.settings['HERALD_RMR2'] == true) {
    localReducedMana += pl.rootScope.ITEMS[0]['HERALD_RMR2'].reduced
  }
  if (pl.rootScope.settings['DISCORD_ARTISAN'] == true) {
    localReducedMana += pl.rootScope.ITEMS[0]['DISCORD_ARTISAN'].reduced
  }

  if(pl.rootScope.itemGroup['CIRCLE'][pl.auraGroup]) {
    var number = parseInt(pl.rootScope.itemGroup['CIRCLE'][pl.auraGroup]) || 0
    localReducedMana += pl.rootScope.LOCAL_ITEMS['CIRCLE'].reduced[number]
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//Blasphemy / Awakened Blasphemy
var blasphemyCalc = function(pl) {
  var localReducedMana = pl.localReducedMana
  if(pl.rootScope.itemGroup['HERETICS_VEIL'][pl.auraGroup]) {
   localReducedMana += pl.rootScope.LOCAL_ITEMS['HERETICS_VEIL'].reduced
  }

  var number = parseInt(pl.rootScope.auraGroup[pl.aura][pl.auraGroup]) || 0

  // Impresence makes first aura in the calc free
  if(pl.rootScope.settings['IMPRESENCE'] == true && number > 0 && !globalTmp['IMPRESENCE_USED']) {
    globalTmp['IMPRESENCE_USED'] = true
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, localReducedMana + 100, pl.globalLessMana, pl.localMutliplier)
    + (calculateAura(pl.rootScope.AURAS[pl.aura].cost, localReducedMana, pl.globalLessMana, pl.localMutliplier) * (number - 1))
  }
  else {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, localReducedMana, pl.globalLessMana, pl.localMutliplier) * number
  }
}

//Artic Armour
var arcticCalc = function(pl) {
  var localReducedMana = pl.localReducedMana
  if(pl.rootScope.settings['PERFECT_FORM']) {
    localReducedMana += pl.rootScope.ITEMS[4]['PERFECT_FORM'].reduced
  }
  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//Wrath (?)
var wrathCalc = function(pl) {
  if(pl.rootScope.settings['AULS_UPRISING']) {
    return 0
  }
  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//Precison
var precisionCalc = function(pl) {
  const glm = [...pl.globalLessMana]
  if(pl.rootScope.settings['HYRRI']) {
    glm.push(50)
  }
  let flatCost = pl.rootScope.AURAS[pl.aura].flat[parseInt(pl.rootScope.auraGroup[pl.aura][pl.auraGroup]) || 0]
  return calculateAura(flatCost, pl.localReducedMana, glm, pl.localMutliplier, true)
}

//Banners
var bannerCalc = function(pl) {
  if(pl.rootScope.settings['INPIRATIONAL']) {
    return 0
  }

  var localAddedRMR = pl.rootScope.ITEMS[1]['MASTER_COMMAND'].reduced
  if(pl.rootScope.settings['MASTER_COMMAND'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }
  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//Cluster Sections

/**
 * Purities
 */
//Purity of Ice
var iceCalc = function(pl) {
  var localAddedRMR = pl.rootScope.ITEMS[1]['PURE_GUILE'].reduced
  if(pl.rootScope.settings['PURE_GUILE'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}


//Purity of Fire
var fireCalc = function(pl) {
  var localAddedRMR = pl.rootScope.ITEMS[1]['PURE_MIGHT'].reduced
  if(pl.rootScope.settings['PURE_MIGHT'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//Purity of Lightning
var lighCalc = function(pl) {
  var localAddedRMR = pl.rootScope.ITEMS[1]['PURE_APT'].reduced
  if(pl.rootScope.settings['PURE_APT'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

/**
 * Defence Auras
 */

//Discipline
var discCalc = function(pl) {
  var localAddedRMR = pl.rootScope.ITEMS[1]['SELF_CONTROL'].reduced
  if(pl.rootScope.settings['SELF_CONTROL'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//DETERMINATION
var detCalc = function(pl) {
  var localAddedRMR = pl.rootScope.ITEMS[1]['UNCOMPROMISING'].reduced
  if(pl.rootScope.settings['UNCOMPROMISING'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}

//Grace

var graceCalc = function(pl) {
  var localAddedRMR = pl.rootScope.ITEMS[1]['SUBLIME_FORM'].reduced
  if(pl.rootScope.settings['SUBLIME_FORM'] == true) {
    return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana+localAddedRMR, pl.globalLessMana, pl.localMutliplier)
  }

  return calculateAura(pl.rootScope.AURAS[pl.aura].cost, pl.localReducedMana, pl.globalLessMana, pl.localMutliplier)
}


var globalAura = {
	ANGER: { cost: 50, aura: true, title: "Anger" },
	HATRED: { cost: 50, aura: true, title: "Hatred" },
	WRATH: { cost: 50, aura: true, title: "Wrath", override: wrathCalc },

	HASTE: { cost: 50, aura: true, title: "Haste" },
	MALEVOLENCE: { cost: 50, aura: true, title: "Malevolence" },
	ZEALOTRY: { cost: 50, aura: true, title: "Zealotry" },

  PURITY_FIRE: { cost: 35, aura: true, title: "Purity of Fire", override: fireCalc },
  PURITY_ICE: { cost: 35, aura: true, title: "Purity of Ice", override: iceCalc },
  PURITY_LIGHTNING: { cost: 35, aura: true, title: "Purity of Lightning", override: lighCalc },

	DISCIPLINE: { cost: 35, aura: true, title: "Discipline", override: discCalc },
	GRACE: { cost: 50, aura: true, title: "Grace", override: graceCalc},
  DETERMINATION: { cost: 50, aura: true, title: "Determination", override: detCalc },


	PURITY_ELEMENTS: { cost: 35, aura: true, title: "Purity of Elements" },
	ENVY: { cost: 50, aura: true, item: true, title: "Envy", description: "Granted by United in Dream Cutlass" },
	ASPECT: { cost: 25, buff: true, title: "Aspect", singleImg: true, description: "There are currently 4 aspect auras introduced in bestiary: cat, avian, spider, and crab", override: aspectCalc},

	CLARITY: { flat: [0, 34, 48, 61, 76, 89, 102, 115, 129, 141, 154, 166, 178, 190, 203, 214, 227, 239, 251, 265, 279, 293, 303, 313, 323, 333, 343, 353, 363, 373, 383, 383], title: "Clarity", aura: true, number: true, max: 30 },
	PRECISION: { flat: [0, 22, 32, 40, 50, 59, 68, 76, 86, 94, 102, 110, 118, 126, 135, 142, 151, 159, 167, 176, 186, 195, 202, 208, 215, 222, 228, 235, 242, 248, 255], title: "Precision", aura: true, number: true, max: 30, override: precisionCalc },
  VITALITY: { flat: [0, 28, 40, 51, 63, 74, 85, 96, 108, 118, 128, 138, 148, 158, 169, 178, 189, 199, 209, 221, 233, 244, 253, 261, 269, 278, 286, 294, 303, 311, 319], title: "Vitality", aura: true, number: true, max: 30 },

	FLESH_AND_STONE: { cost: 25, aura: true, title: "Flesh and Stone" },
	BLOOD_AND_SAND: { cost: 10, buff: true, title: "Blood and Sand" },
	ARCTIC: { cost: 25, buff: true, title: "Arctic Armour", override: arcticCalc },

	PRIDE: { cost: 50, aura: true, title: "Pride" },
  WAR_BANNER: { cost: 10, aura: true, banner: true, can_drop: true, title: "War Banner", override: bannerCalc },
	DREAD_BANNER: { cost: 10, aura: true, banner: true, can_drop: true, title: "Dread Banner", override: bannerCalc },

  HERALD_AGONY: { cost: 25, buff: true, title: "Herald of Agony", override: heraldCalc },
  HERALD_ASH: { cost: 25, buff: true, title: "Herald of Ash", override: heraldCalc },
  HERALD_ICE: { cost: 25, buff: true, title: "Herald of Ice", override: heraldCalc },
  HERALD_PURITY: { cost: 25, buff: true, title: "Herald of Purity", override: heraldCalc },
  HERALD_THUNDER: { cost: 25, buff: true, title: "Herald of Thunder", override: heraldCalc },
	SKITTERBOTS: { cost: 35, buff: true, title: "Sitterbots" },
	BLASPHEMY: { cost: 35, title: "Blasphemy", curse: true, override: blasphemyCalc, singleImg: true, max: 6, number: true, description: "The ingame curse limit is 6, each aura stacked has a mana reservation override of 35%" },

	AWAKENED_BLASPHEMY: { cost: 32, title: "Awakened Blasphemy", curse: true, override: blasphemyCalc, singleImg: true, max: 6, number: true, description: "The ingame curse limit is 6, each aura stacked has a mana reservation override of 32% (Level 5-6 Gem)" }

}

var globalLocalItem = {

	ENLIGHTEN: { multi: [100, 100, 96, 92, 88, 84, 80, 76, 72, 68, 64], number: true, max: 10, title: "Enlighten" },
  EMPOWER: { multi: 125, title: "Empower" },
  ENHANCE: { multi: 115, title: "Enhance" },

  BLOOD_GEM: { multi: [100, 245, 242, 239, 237, 234, 232, 229, 226, 224, 221, 218, 216, 213, 211, 208, 205, 203, 200, 197, 196, 193, 190, 187, 184, 181, 178, 175, 172, 169, 166], number: true, max: 30, title: "Blood Magic Gem", bloodMagic: true },
  MAIM: {multi: 115, title: "Maim"},
  CIRCLE: { reduced: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],min:10, max: 100, number: true, special: true, title: "Circle of ...", description: "Enter total amounr of Reduced Mana for a given Herald provided by your ring(s)"},

  VICTARIOS: { reduced: 30, type: "CHEST", title: "Victario's Influence" },
  THE_DEVOURING_DIADEM: { reduced: 20, type: "HELM", title: "The Devouring Diadem"},
  VIVINSECT: { reduced: -10, type: "RING", title: "Vivinsect"},

  PRISM_GUARDIAN: { reduced: 25, type: "SHIELD", title: "Prism Guardian", bloodMagic: true },
  SHIELD_TEN: { reduced: 10, type: "SHIELD", title: "Rare local 10% reduced "},
  SHIELD_FIF: { reduced: 15, type: "SHIELD", title: "Rare local 15% reduced"},
  //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]
  //GENEROSITY: { multi: 100, title: "Generosity" },

  AULS_UPRISING: { reduced: 100, title: "Aul's Uprising", special: true, description: "Makes random aura cost no mana. For purposes of this calculator, it makes everything in the aura group reserve nothing, and you can only select one aura (the amulet doesn't have a socket - so the aura gem would be elsewhere)" },

  ESSENCE_WORM: { multi: 0, type: "RING", title: "Essence Worm", special: true, description: "Socketed aura will have no mana reservation cost, but increases global mana reservation costs by 40% for each ring" },
  HERETICS_VEIL: { reduced: 12, type: "HELM", title: "Heretic's Veil", special: true, description: "Reduced mana multiplier only applies to Blasphemy curses" },
  MARCH_OF_LEGION: { reduced: 0, type: "BOOTS", special: true, title: "March of the Legion", special: true, description: "Supports auras socketed in this item with Blessing support, which makes auras temporary, but still reserves mana for a fraction of time. For the purposes of this calculator, it takes your most expensive aura and sets it as ephemeral" },
  THE_COVENANT: { reduced: 0, type: "CHEST", title: "The Covenant", bloodMagic: true }

}

var globalItem = [{
  BLOOD_MAGIC: { multi: 100, title: "Blood Magic", bloodMagic: true },
  MORTAL_CONVICTION: { reduced: 100, special: true, disabled: "!settings['BLOOD_MAGIC']", title: "Mortal Conviction", bloodMagic: true, description: "Allows you to have one non-banner aura, which is free" },
  EGO: { less: -50, title: "Supreme Ego" },

  INPIRATIONAL: { reduced: 100, special: true,  title: "Inpirational", description: "From the Champion Ascendancy, makes banner skills free" },
  SANCTUARY_OF_THOUGHT: { less: 10, title: "Sanctuary of Thought", description: "From the Hierophant Ascendancy" },
  MASTERMIND_DISCORD: { reduced: 25, title: "Mastermind of Discord", special: true, description: "From the Elementalist Ascendancy, only applies to heralds" },

  HERALD_RMR: { reduced: 5, title: "Reduced Mana of Heralds", special: true, description: "Only applies to heralds" },
  HERALD_RMR2: { reduced: 5, title: "Reduced Mana of Heralds x2", special: true, description: "Only applies to heralds",  disabled: "!settings['HERALD_RMR']" },
  DISCORD_ARTISAN: { reduced: 10, title: "Discord Artisan", special: true, description: "Only applies to heralds" },

  }, {
	PURE_MIGHT: { reduced: 30, title: "Pure Might", special: true, description: "30% Reduced reservation of Purity of Fire"},
	PURE_GUILE: { reduced: 30, title: "Pure Guile", special: true, description: "30% Reduced reservation of Purity of Ice"},
	PURE_APT: { reduced: 30, title: "Pure Aptitude", special: true, description: "30% Reduced reservation of Purity of Lightning"},

	SELF_CONTROL: { reduced: 30, title: "Self-Control", special: true, description: "30% Reduced reservation of Discipline"},
	SUBLIME_FORM: { reduced: 30, title: "Sublime Form", special: true, description: "30% Reduced reservation of Grace"},
	UNCOMPROMISING: { reduced: 30, title: "Uncompromising", special: true, description: "30% Reduced reservation of Determination"},

	MASTER_COMMAND: { reduced: 50, title: "Master of Command", special: true, description: "50% Reduced reservation of Banners"},
  }, {
  ALPHAS_HOWL: { reduced: 8, type: "HELM", title: "Alpha's Howl" },
	MASK_TRIBUNAL: { reduced: 0, special: true, type: "HELM", title: "Mask of the Tribunal", description: "Adds 1% reduced mana per 250 to all stats. Add the number manually to reduced mana field"},
	MEMORY_VAULT: { reduced: -10, type: "HELM", title: "Memory Vault" },

  RARE_RMR: { reduced: 5, type: "HELM", title: "Rare 5% redcued" },
	RARE_DBL_RMR: { reduced: 10, type: "HELM", title: "Rare 10% reduced" },
  }, {
  CONQUERORS: { reduced: 2, title: "Conqueror's Efficiency" },
  }, {
	IMPRESENCE: { reduced: 100, type: "AMULET", special: true, title: "Impresence", description: "For the purposes of this calculator, it will set your first blasphemy aura to have 100% reduced reservation" },
  HYRRI: { reduced: 50, title: "Hyrri's Truth", special: true, description: "Precision aura cost is halved" },
  SKYFORTH: { reduced: 6, type: "BOOTS", title: "Skyforth" },

  SAQAWALS_NEST: { reduced: 10, type: "CHEST", title: "Saqawal's Nest", description: "Item has reduced mana roll range of 6 to 10, but for the purposes of this calculator I assume you got a maxed roll" },
  CALAMITY: { setTo: 45, type: "CHEST", title: "The Coming Calamity", special: true, description: "All hearlds are always set to 45% reservation" },
  PERFECT_FORM: { reduced: 100, type: "CHEST", title: "The Perfect Form", special: true, description: "Gives arctic armour 100% reduced reservation" }
  }, {
  ICHIMONJI: { reduced: 5, type: "1HAND", title: "Ichimonji" },
  ICHIMONJI2: { reduced: 5, type: "1HAND", title: "Ichimonji x2", disabled: "!settings['ICHIMONJI']"  },
  },{
  MIDNIGHT_BARGAIN: { setTo: 30, type: "WAND", title: "Midnight Bargain", bloodMagic: true },
  MIDNIGHT_BARGAIN2: { setTo: 30, type: "WAND", title: "Midnight Bargain x2", bloodMagic: true, disabled: "!settings['MIDNIGHT_BARGAIN']" },
}
]

angular.module("poeAura", [])
.constant("AURAS", globalAura)
.constant("LOCAL_ITEMS", globalLocalItem)
.constant("ITEMS", globalItem)
.run(function ($rootScope, AURAS, LOCAL_ITEMS, ITEMS) {
  $rootScope.AURAS = AURAS
  $rootScope.LOCAL_ITEMS = LOCAL_ITEMS
  $rootScope.ITEMS = ITEMS
  $rootScope.ALL_ITEMS = {}
  $rootScope.viewing = false
  $rootScope.ALL_ITEMS = ITEMS.reduce(function(result, current) {
    return Object.assign(result, current)
  }, {})
  $rootScope.Math = window.Math
  $rootScope.resetForm = function(skipPrompt) {
    if(!skipPrompt && !confirm('Are you sure you want to reset the page?')) {
      return
    }
    $rootScope.reserved = {}
    $rootScope.multiplier = { BLOOD_GEM: {}, ENLIGHTEN: {} }
    $rootScope.auraGroups = [0]
    $rootScope.auraGroup = { REDUCED_MANA: { 0: 0 }, MULTIPLIER: { 0: 100 } }
    $rootScope.bmGroup = {}
    $rootScope.itemGroup = {}
    $rootScope.settings = { reducedMana: 0, amuletRMR: 0, jewelRMR: 0  }
    $rootScope.viewing = false
    $rootScope.life = $rootScope.mana = 1000
    $rootScope.onlyNumbers = /^\d+$/
    $rootScope.lifeReservedPercent = $rootScope.manaReservedPercent = 0


    Object.keys(AURAS).forEach(function(elem) {
      $rootScope.reserved[elem] = {}
      $rootScope.auraGroup[elem] = {}
    })

    Object.keys(LOCAL_ITEMS).forEach(function(elem) {
      $rootScope.itemGroup[elem] = {}
    })

    for (let item in ITEMS) {
      Object.keys(ITEMS[item]).forEach(function(elem) {
        $rootScope.settings[elem] = false
      })
    }

    if(!skipPrompt) {
      $rootScope.recalc()
      location.replace("#")
    }
  }
  $rootScope.resetForm(true)

  $rootScope.addAuraGroup = function() {
    let lastElement = $rootScope.auraGroups[$rootScope.auraGroups.length-1]
    $rootScope.auraGroups.push(lastElement + 1)
    $rootScope.auraGroup.MULTIPLIER[lastElement + 1] = 100
    $rootScope.auraGroup.REDUCED_MANA[lastElement + 1] = 0
    $rootScope.recalc()
  }

  $rootScope.isDimmed = function(bm, flat, key, index) {
    var reserved = $rootScope.reserved[key][index]
    var isFlat = typeof flat != "undefined"
    if($rootScope.reserved['NEXT_' + key] && $rootScope.reserved['NEXT_' + key][index]) {
      reserved = $rootScope.reserved['NEXT_' + key][index]
    }
    if(isFlat) {
      return (bm && $rootScope.lifeReservedNumeric + reserved) >= $rootScope.life ||
        (!bm && $rootScope.manaReservedNumeric + reserved) > $rootScope.mana
    }
    else {
      return (bm && $rootScope.lifeReservedPercent + reserved) >= 100 ||
        (!bm && $rootScope.manaReservedPercent + reserved) > 100
    }
  }

  $rootScope.deleteAuraGroup = function(index, skipPrompt) {
    if(!skipPrompt && !confirm(`Are you sure you wish to delete aura group ${index + 1}?`)) {
      return
    }

    // Compress array as necessary
    for(let i=index; i < $rootScope.auraGroups.length; i++) {
      for (let localItem in LOCAL_ITEMS) {
        if(i == $rootScope.auraGroups.length) {
          delete $rootScope.itemGroup[localItem][localItem][i]
        }
        else {
          $rootScope.itemGroup[localItem][i] = $rootScope.itemGroup[localItem][i + 1]
        }
      }
      for (let aura in AURAS) {
        if(i == $rootScope.auraGroups.length) {
          delete $rootScope.auraGroup[aura][i]
        }
        else {
          $rootScope.auraGroup[aura][i] = $rootScope.auraGroup[aura][i + 1]
        }
      }
    }

    // Remove aura group
    var auraGroups = []
    for(let i=0; i < $rootScope.auraGroups.length - 1; i++) {
      auraGroups.push(i)
    }
    $rootScope.auraGroups = auraGroups
    $rootScope.recalc()
  }

  // Disables items around special cases like essence worm or aul's uprising
  $rootScope.specialDisabled = function(name, index) {
    // Disable everything while viewing, or number fields
    if($rootScope.viewing) {
      return true
    }

    // Essence worm selected
    if($rootScope.itemGroup['ESSENCE_WORM'][index]) {
      return name !== 'ESSENCE_WORM'
    }

    let aurasSelected = 0

    if(name === 'AULS_UPRISING' || name === 'ESSENCE_WORM') {
      for (let aura in AURAS) {
        if($rootScope.auraGroup[aura][index]) {
          // Aura is incompatible
          if(AURAS[aura].number && !AURAS[aura].flat) {
            return true
          }
          // Granted by item isn't compatible
          if(AURAS[aura].item) {
            return true
          }
          aurasSelected++
          // Too many auras selected
          if(aurasSelected > 1) {
            return true
          }
          // I think auls doesn't support heralds
          if(name == 'AULS_UPRISING' && AURAS[aura].buff) {
            return true
          }
        }
      }
    }

    // Disable essence worm if anything else is selected
    for (let item in LOCAL_ITEMS) {
      if($rootScope.itemGroup[item][index] && name == 'ESSENCE_WORM') {
        return true
      }
    }
    return false
  }

  // Disables most gems when something special is selected
  $rootScope.specialGemDisabled = function(name, index) {
    // Disable everything while viewing, or number fields
    if($rootScope.viewing) {
      return true
    }

    const ESSENCE = $rootScope.itemGroup['ESSENCE_WORM'][index]
	const VIVIN = $rootScope.itemGroup['VIVINSECT'][index]
    const AULS = $rootScope.itemGroup['AULS_UPRISING'][index]
    const MC = $rootScope.settings['MORTAL_CONVICTION']
    const EGO = $rootScope.settings['EGO']

    // Never disable anything that is selected, or if the specials aren't selected
    if($rootScope.auraGroup[name][index] || (!ESSENCE && !AULS && !MC && !EGO && !VIVIN)) {
      return false
    }

    // Disable if number field and essence worm is selected (and not flat)
    if(AURAS[name].number && !AURAS[name].flat && (VIVIN || ESSENCE || AULS)) {
      return true
    }

    // Disable if granted from item (incompatible with specials)
    if(AURAS[name].item && (VIVIN || ESSENCE || AULS)) {
      return true
    }

    if (MC) {
      let auraWithoutBannersCount = 0
      for (let aura in AURAS) {
        for (let i in $rootScope.auraGroups) {
          if($rootScope.auraGroup[aura][i] && !AURAS[aura].banner) {
            auraWithoutBannersCount++
          }
        }
      }

      if (auraWithoutBannersCount >= 1 && !AURAS[name].banner) {
        return true
      }
    }

    // Disable buffs if auls is selected
    if (AURAS[name].buff && AULS) {
      return true
    }

    if (VIVIN || ESSENCE || AULS || EGO) {
      for (let aura in AURAS) {
        if ($rootScope.auraGroup[aura][index]) {
          return true
        }
        if (EGO) {
          for (let i in $rootScope.auraGroups) {
            if ($rootScope.auraGroup[aura][i]) {
              return true
            }
          }
        }
      }
    }

    return false
  }

  // Tries to disable columns on incompatible items
  $rootScope.itemDisabled = function(name, index) {
    var isItemGroup = typeof index !== "undefined"
    var type = isItemGroup ? LOCAL_ITEMS[name]["type"] : $rootScope.ALL_ITEMS[name]["type"]

    // Disable everything while viewing
    if($rootScope.viewing) {
      return true
    }

    if(name == 'MORTAL_CONVICTION' && !$rootScope.settings['MORTAL_CONVICTION']) {
      let auraWithoutBannersCount = 0
      for (let aura in AURAS) {
        for (let i in $rootScope.auraGroups) {
          if($rootScope.auraGroup[aura][i] && !AURAS[aura].banner) {
            auraWithoutBannersCount++
          }
        }
      }

      if(auraWithoutBannersCount > 1) {
        return true
      }
    }

    // 2+ auras disables supreme ego
    if (name == 'EGO' && !$rootScope.settings['EGO']) {
      let auraCount = 0
      for (let aura in AURAS) {
        for (let i in $rootScope.auraGroups) {
          if($rootScope.auraGroup[aura][i]) {
            auraCount++
            if(auraCount > 1) {
              return true
            }
          }
        }
      }
    }

    // Doesn't have any rules for disabling
    if(typeof type == "undefined") {
      return false
    }

    // Never disable anything that is selected
    if(isItemGroup && $rootScope.itemGroup[name][index]) {
      return false
    }
    if(!isItemGroup && $rootScope.settings[name]) {
      return false
    }

    // Allow multiple of the same item for separate itemgroups
    if(isItemGroup && globalTmp['itemComboUsed'][name]) {
      return false
    }

    // Disallow multipule item types to be selected at once
    if(isItemGroup) {
      for (let item in LOCAL_ITEMS) {
        if($rootScope.itemGroup[item][index] && LOCAL_ITEMS[item].type) {
          return true
        }
      }
    }

    // Hands are all together
    if(type == '1HAND' || type == 'WAND' || type == 'SHIELD') {
      return $rootScope.itemCombo['1HAND'] + $rootScope.itemCombo['WAND'] + $rootScope.itemCombo['SHIELD'] >= 2
    }

    if($rootScope.itemCombo[type] >= 1) {
      return true
    }

    return false
  }

  $rootScope.recalc = function(obj, skipHash) {
    // Toggle dependent settings
    if(typeof obj !== "undefined") {
      switch(obj.key) {
        case 'BLOOD_MAGIC':
          $rootScope.settings['MORTAL_CONVICTION'] = false
          break
        case 'ICHIMONJI':
          $rootScope.settings['ICHIMONJI2'] = false
          break
        case 'MIDNIGHT_BARGAIN':
          $rootScope.settings['MIDNIGHT_BARGAIN2'] = false
          break
        case 'HERALD_RMR':
          $rootScope.settings['HERALD_RMR2'] = false
          break
      }
    }

    var globalReducedMana = $rootScope.settings['reducedMana'] + $rootScope.settings['amuletRMR'] + $rootScope.settings['jewelRMR'] || 0
    var globalLessMana = []
    var percentageReserved = [0, 0]
    var percentageReservedDroppable = [0, 0]
    var flatReserved = [0, 0]
    $rootScope.bloodMagic = false
    $rootScope.itemCombo = { "HELM": 0, "1HAND": 0, "WAND": 0, "BOOTS": 0, "CHEST": 0, "AMULET": 0, "SHIELD": 0, "RING": 0 }
    $rootScope.auraSelected = {}
    $rootScope.totalAuras = 0
    globalTmp = { itemComboUsed: {} }

    // Set simple modifiers
    for (let itemGroup in ITEMS) {
      for (let item in ITEMS[itemGroup]) {
        if($rootScope.settings[item] == true && ITEMS[itemGroup][item].special != true) {
          if(typeof ITEMS[itemGroup][item].reduced !== "undefined") {
            globalReducedMana += ITEMS[itemGroup][item].reduced
          }
          if(typeof ITEMS[itemGroup][item].less !== "undefined") {
            globalLessMana.push(ITEMS[itemGroup][item].less)
          }
          if(ITEMS[itemGroup][item].bloodMagic && typeof ITEMS[itemGroup][item].setTo == "undefined") {
            $rootScope.bloodMagic = true
          }
        }

        if($rootScope.settings[item] == true && ITEMS[itemGroup][item].type) {
          $rootScope.itemCombo[ITEMS[itemGroup][item].type]++
        }
      }
    }

    // Loop through again to pick up any modifiers affected by blood magic or reduced mana
    for (let itemGroup in ITEMS) {
      for (let item in ITEMS[itemGroup]) {
        if($rootScope.settings[item] == true && ITEMS[itemGroup][item].special != true) {
          if(typeof ITEMS[itemGroup][item].setTo != "undefined") {
            percentageReserved[ITEMS[itemGroup][item].bloodMagic ? 1 : 0] += ITEMS[itemGroup][item].setTo
          }
        }
      }
    }

    // Essence worm increases global mana reservation
    for (let i in $rootScope.auraGroups) {
      if($rootScope.itemGroup['ESSENCE_WORM'][i]) {
        globalReducedMana -= 40
      }
    }

    // Calculate auras from aura groups
    for (let i in $rootScope.auraGroups) {
      var localReducedMana = ($rootScope.auraGroup['REDUCED_MANA'][i] || 0) + globalReducedMana
      var localMutliplier = $rootScope.auraGroup['MULTIPLIER'][i] || 100
      $rootScope.bmGroup[i] = $rootScope.bloodMagic

      for (let localItem in LOCAL_ITEMS) {
        if(LOCAL_ITEMS[localItem].number == true) {
          if(typeof LOCAL_ITEMS[localItem].multi !== "undefined") {
            let multiplier = LOCAL_ITEMS[localItem].multi[parseInt($rootScope.itemGroup[localItem][i]) || 0]
            $rootScope.multiplier[localItem][i] = multiplier
            localMutliplier *= multiplier / 100
          }
          if(parseInt($rootScope.itemGroup[localItem][i]) && LOCAL_ITEMS[localItem].bloodMagic) {
            $rootScope.bmGroup[i] = true
          }
        }
        else if($rootScope.itemGroup[localItem][i] == true && LOCAL_ITEMS[localItem].special != true) {
          if(typeof LOCAL_ITEMS[localItem].multi !== "undefined") {
            localMutliplier *= LOCAL_ITEMS[localItem].multi / 100
          }
          else if(typeof LOCAL_ITEMS[localItem].reduced !== "undefined") {
            localReducedMana += LOCAL_ITEMS[localItem].reduced
          }
          if(LOCAL_ITEMS[localItem].bloodMagic) {
            $rootScope.bmGroup[i] = true
          }
        }

        // Track combos of items used
        if($rootScope.itemGroup[localItem][i] && LOCAL_ITEMS[localItem].type && !globalTmp['itemComboUsed'][localItem]) {
          globalTmp['itemComboUsed'][localItem] = true
          $rootScope.itemCombo[LOCAL_ITEMS[localItem].type]++
        }
      }

      for (let aura in AURAS) {
        // Essence worm and auls uprising makes auras free
        if($rootScope.itemGroup['ESSENCE_WORM'][i]
          || $rootScope.itemGroup['AULS_UPRISING'][i]
          || ($rootScope.settings['MORTAL_CONVICTION'] && !AURAS[aura].banner)) {
          $rootScope.reserved[aura][i] = 0
        }
        // Aura has custom function
        else if(AURAS[aura].override) {
          if(AURAS[aura].number == true) {
            if(typeof $rootScope.reserved['NEXT_' + aura] == "undefined") {
              $rootScope.reserved['NEXT_' + aura] = {}
            }
            $rootScope.reserved['NEXT_' + aura][i] = calculateAura(AURAS[aura].cost, localReducedMana, globalLessMana, localMutliplier)
          }

          let payload = {
            rootScope: $rootScope,
            auraGroup: i,
            localReducedMana: localReducedMana,
            globalLessMana: globalLessMana,
            localMutliplier: localMutliplier,
            aura: aura
          }

          $rootScope.reserved[aura][i] = AURAS[aura].override(payload)
          if (AURAS[aura].number == true && AURAS[aura].curse != true) {
            flatReserved[$rootScope.bmGroup[i] ? 1 : 0] += $rootScope.reserved[aura][i]
          }
        }
        // Flat aura
        else if(AURAS[aura].flat) {
          let flatCost = AURAS[aura].flat[parseInt($rootScope.auraGroup[aura][i]) || 0]
          flatCost = calculateAura(flatCost, localReducedMana, globalLessMana, localMutliplier, true)
          $rootScope.reserved[aura][i] = flatCost
          flatReserved[$rootScope.bmGroup[i] ? 1 : 0] += flatCost
        }

        // Numerical aura
        else if(AURAS[aura].number == true) {

          if(typeof $rootScope.reserved['NEXT_' + aura] == "undefined") {
            $rootScope.reserved['NEXT_' + aura] = {}
          }
          $rootScope.reserved['NEXT_' + aura][i] = calculateAura(AURAS[aura].cost, localReducedMana, globalLessMana, localMutliplier)

          let number = parseInt($rootScope.auraGroup[aura][i]) || 0
          $rootScope.reserved[aura][i] = calculateAura(AURAS[aura].cost, localReducedMana, globalLessMana, localMutliplier) * number
        }

        // Standard checkbox aura
        else {
          $rootScope.reserved[aura][i] = calculateAura(AURAS[aura].cost, localReducedMana, globalLessMana, localMutliplier)
        }

        // Apply if selected
        if($rootScope.auraGroup[aura][i] && !$rootScope.itemGroup['MARCH_OF_LEGION'][i] && !AURAS[aura].flat) {
          $rootScope.auraSelected[aura] = true
          if(AURAS[aura].can_drop) {
            percentageReservedDroppable[$rootScope.bmGroup[i] ? 1 : 0] += $rootScope.reserved[aura][i]
          }
          else {
            percentageReserved[$rootScope.bmGroup[i] ? 1 : 0] += $rootScope.reserved[aura][i]
          }
        }
      }
    }

      // March of the legion calculates most expensive aura and adds it as temporary

    let highestAura = [0, 0]
    for (let i in $rootScope.auraGroups) {
      if($rootScope.itemGroup['MARCH_OF_LEGION'][i]) {
        for (let aura in AURAS) {
          if($rootScope.auraGroup[aura][i] && $rootScope.reserved[aura][i] > highestAura[$rootScope.bmGroup[i] ? 1 : 0] && !AURAS[aura].flat) {
            highestAura[$rootScope.bmGroup[i] ? 1 : 0] = $rootScope.reserved[aura][i]
          }
        }
      }
    }
    percentageReservedDroppable[0] += highestAura[0]
    percentageReservedDroppable[1] += highestAura[1]

    for (let aura in $rootScope.auraSelected) {
      if(AURAS[aura].aura) {
        $rootScope.totalAuras++
      }
    }

    $rootScope.settings['life'] = $rootScope.life
    $rootScope.settings['mana'] = $rootScope.mana

    $rootScope.life = Math.max(Math.min($rootScope.life, 30000), 1)
    $rootScope.mana = Math.max(Math.min($rootScope.mana, 30000), 1)

    //$rootscope.percentageReservedDroppable

    $rootScope.lifeReservedNumeric = Math.ceil($rootScope.life * ((percentageReserved[1] / 100) + (percentageReservedDroppable[1] / 100))) + flatReserved[1]
    $rootScope.manaReservedNumeric = Math.ceil($rootScope.mana * ((percentageReserved[0] / 100) + (percentageReservedDroppable[0] / 100))) + flatReserved[0]

    $rootScope.minLifeReservedNumeric = Math.ceil($rootScope.life * (percentageReserved[1] / 100)) + flatReserved[1]
    $rootScope.minManaReservedNumeric = Math.ceil($rootScope.mana * (percentageReserved[0] / 100)) + flatReserved[0]

    /*
      This is a very special case: If you're running CI the game will not allow you
      to run any auras off life. I think GGG made a manual exception to always
      reserve something, even though they're rounding down all the time.

      I did the same thing to mana for consistency, although I don't think its
      possible to have 1 mana
    */
    if($rootScope.lifeReservedNumeric == 0 && $rootScope.life == 1 && percentageReserved[1]) {
      $rootScope.lifeReservedNumeric = 1
      $rootScope.minLifeReservedNumeric = 1
    }
    if($rootScope.manaReservedNumeric == 0 && $rootScope.mana == 1 && percentageReserved[0]) {
      $rootScope.manaReservedNumeric = 1
      $rootScope.minManaReservedNumeric = 1
    }

    // Keep percentages within 0-100 range
    var percentFixed = function(num) {
      return Math.max(Math.round(num * 100), 0)
    }

    $rootScope.lifeReservedPercent = percentFixed($rootScope.lifeReservedNumeric / $rootScope.life)
    $rootScope.manaReservedPercent = percentFixed($rootScope.manaReservedNumeric / $rootScope.mana)

    $rootScope.minLifeReservedPercent = percentFixed($rootScope.minLifeReservedNumeric / $rootScope.life)
    $rootScope.minManaReservedPercent = percentFixed($rootScope.minManaReservedNumeric / $rootScope.mana)

    // Global blood magic removes all mana
    if($rootScope.bloodMagic) {
      $rootScope.manaReservedNumeric = 0
      $rootScope.manaReservedPercent = 100
      $rootScope.minManaReservedNumeric = 0
      $rootScope.minManaReservedPercent = 100
    }

    $rootScope.lifeRemaining = $rootScope.life - $rootScope.lifeReservedNumeric
    $rootScope.manaRemaining = ($rootScope.bloodMagic ? 0 : $rootScope.mana) - $rootScope.manaReservedNumeric

    $rootScope.minLifeRemaining = $rootScope.life - $rootScope.minLifeReservedNumeric
    $rootScope.minManaRemaining = ($rootScope.bloodMagic ? 0 : $rootScope.mana) - $rootScope.minManaReservedNumeric

    // Url encoding!
    if(!skipHash) {
      var bin = ""
      var hash = []
/*
      // Encode settings
      for (let s in settingsEncode) {
        if(settingsEncode[s][1] == 1) {
          bin += $rootScope.settings[settingsEncode[s][0]] ? 1 : 0
        }
        else {
          bin += pad(($rootScope.settings[settingsEncode[s][0]] ? parseInt($rootScope.settings[settingsEncode[s][0]]) : 0).toString(2), settingsEncode[s][1])
        }
      }
	  */
	//for (let i in $rootScope.settings){


		var hashGroupS = []
		for (let s in settingsEncode) {


			var bin = ""

			for (let t in settingsEncode[s]){


				var value = null


				if(settingsEncode[s][t][0]){

					value = $rootScope.settings[settingsEncode[s][t][0]]

				}

				if(settingsEncode[s][t][1] == 1){
					bin += value ? 1 : 0

				} else {
					bin += pad((value ? parseInt(value) : 0).toString(2), settingsEncode[s][t][1])

				}
			}
			hashGroupS.push(alpha.encode(parseInt(bin,2)))
		}
		hash.push(hashGroupS.join("."))


	//}

    //hash.push(alpha.encode(parseInt(bin,2)))

      // Encode each aura group
      for (let i in $rootScope.auraGroups) {
        var hashGroup = []
        for (let a in aurasEncode) {
          var bin = ""
          for (let b in aurasEncode[a]) {
            var value = null
            if(LOCAL_ITEMS[aurasEncode[a][b][0]]) {
              value = $rootScope.itemGroup[aurasEncode[a][b][0]][i]
            }
            else if(AURAS[aurasEncode[a][b][0]]) {
              value = $rootScope.auraGroup[aurasEncode[a][b][0]][i]
            }
            else if(typeof $rootScope.auraGroup[aurasEncode[a][b][0]][i] !== "undefined") {
              value = $rootScope.auraGroup[aurasEncode[a][b][0]][i]
            }
            else
            {
              console.log('Could not find:', aurasEncode[a][b][0])
            }

            if(aurasEncode[a][b][1] == 1) {
              bin += value ? 1 : 0
            }
            else {
              bin += pad((value ? parseInt(value) : 0).toString(2), aurasEncode[a][b][1])
            }
          }
          hashGroup.push(alpha.encode(parseInt(bin,2)))
        }
        hash.push(hashGroup.join("."))
      }

      location.replace("#" + hash.join("/"))
    }
  }

  var hash = window.location.hash.substr(1)

  // Load from URL
  if(hash.length > 0) {

	data = hash.split("/")
    var bin = pad(alpha.decode(data[0]).toString(2), 65)
    var pos = 0

	var settData = data[0].split(".")


	for(b=0; b <= settData.length -1; b++){

		var bin = pad(alpha.decode(settData[b]).toString(2), 65)
		var pos = 0



		for(i=settingsEncode[b].length - 1; i >= 0; i--) {

			pos += settingsEncode[b][i][1]


			var bindata = parseInt(bin.substr((pos * -1 ? pos * -1 : 0), settingsEncode[b][i][1]).toString(), 2)

			if(settingsEncode[b][i][1] == 1) {
			bindata = bindata ? true : false

			}


			$rootScope.settings[settingsEncode[b][i][0]] = bindata
		}

	}

    $rootScope.auraGroups = []
    for(let i=0; i < data.length - 1; i++) {
      $rootScope.auraGroups.push(i)
    }

    for(a=0; a < $rootScope.auraGroups.length; a++) {

      // I discovered I met the javascript limit of 2^53 for binary numbers really fast... so here's
      // a period seperator to space out some of the data in the urls, added later unfortunately.

      var auraData = data[a + 1].split(".")

      for(d=0; d <= auraData.length - 1; d++) {
        var bin = pad(alpha.decode(auraData[d]).toString(2), 65)
        var pos = 0

        for(i=aurasEncode[d].length - 1; i >= 0; i--) {
          pos += aurasEncode[d][i][1]
          var bindata = parseInt(bin.substr((pos * -1 ? pos * -1 : 0), aurasEncode[d][i][1]).toString(), 2)

          if(aurasEncode[d][i][1] == 1) {
            bindata = bindata ? true : false
          }

          if(LOCAL_ITEMS[aurasEncode[d][i][0]]) {
            $rootScope.itemGroup[aurasEncode[d][i][0]][a] = bindata
          }
          else {
            $rootScope.auraGroup[aurasEncode[d][i][0]][a] = bindata
          }
        }
      }
    }

    $rootScope.life = $rootScope.settings['life']
    $rootScope.mana = $rootScope.settings['mana']
    $rootScope.viewing = true
  }

  document.querySelectorAll("a[rel=external]").forEach(function(link) {
    link.target = "_blank"
  })

  // Finished loading, display app
  $rootScope.recalc({}, true)
  angular.element(document.getElementById("loading")).remove()
  document.getElementById("container").style.display = "block"
})
.controller('TestController', ['$rootScope', '$scope', function($rootScope, $scope) {
    $rootScope.TESTS = TESTS
    let FINISHED_TESTS = []

    const status = function(res) {
      return res ? 'success' : 'error'
    }

    for (let i in TESTS) {
      let grp = 0
      for (let j in TESTS[i]['groups']) {
        $rootScope.auraGroup[grp] = {}
        const group = TESTS[i]['groups'][j]
        for (let k in group['auras']) {
          [aura] = group['auras'][k]
          $rootScope.auraGroup[aura][grp] = true
        }
        grp++
      }
      $rootScope.life = TESTS[i]['life'][0]
      $rootScope.mana = TESTS[i]['mana'][0]

      $rootScope.recalc({}, true)

      grp = 0
      let result = {groups: []}
      for (let j in TESTS[i]['groups']) {
        const group = TESTS[i]['groups'][j]
        let resultGrp = []
        for (let k in group['auras']) {
          [aura, num, expected] = group['auras'][k]
          resultGrp.push([
            status($rootScope.reserved[aura][grp] === expected),
            `${aura}${num ? ` [LVL ${num}]` : ''} got ${$rootScope.reserved[aura][grp]}, expected ${expected}`
          ])

        }
        result['groups'].push(resultGrp)
        grp++
      }

      result['life'] = [
        status($rootScope.lifeRemaining === TESTS[i]['life'][1]),
        `REMAINING LIFE total: ${$rootScope.life}, calculated ${$rootScope.lifeRemaining}, expected ${TESTS[i]['life'][1]}`
      ]

      result['mana'] = [
        status($rootScope.manaRemaining === TESTS[i]['mana'][1]),
        `REMAINING MANA total: ${$rootScope.mana}, calculated ${$rootScope.manaRemaining}, expected ${TESTS[i]['mana'][1]}`
      ]

      FINISHED_TESTS.push(result)
    }
    $rootScope.FINISHED_TESTS = FINISHED_TESTS
    console.log($rootScope.FINISHED_TESTS)

}])
.directive("testGroup", function() {
  return {
    restrict: 'E',
    template: `
  <h4>TEST {{key + 1}}:</h4>
  <div ng-repeat="(key2, test) in tests['groups']" style="padding: 5px 25px">
    <h5>Aura Group {{key2 + 1}}</h5>
    <test-item ng-repeat="t in test" />
  </div>
  <test-item ng-repeat="t in [tests['life'], tests['mana']]" />
`
  }
})
.directive("testItem", function() {
  return {
    restrict: 'E',
    template: `
    <div class={{t[0]}}>
      {{t[0].toUpperCase()}}: {{t[1]}}
    </div>
`
  }
})
.directive("auraGroup", function() {
     return {
     restrict: 'E',
     template: `
<div class="col-sm-6 col-md-4 itemBlock" ng-class="{ edited: auraGroup[key][index] }">
  <label ng-class="{ selected: auraSelected[key], disabled: viewing || specialGemDisabled(key, index), dim: isDimmed(bmGroup[index], item.flat, key, index) }">
    <img ng-if="!item.singleImg" ng-src="img/aura/{{ key | lowercase }}.png">
    <img ng-if="!item.singleImg" ng-src="img/gem/{{ key | lowercase }}.png">
    <img ng-if="item.singleImg" ng-src="img/{{ key | lowercase }}.png">
    <input ng-if="item.number" type="number" ng-change="recalc(this)" ng-disabled="viewing || specialGemDisabled(key, index)" ng-model="auraGroup[key][index] "min="0" max="{{ item.max }}" ng-pattern="onlyNumbers" placeholder="num" />
    <input ng-if="!item.number" type="checkbox" ng-change="recalc(this)" ng-disabled="viewing || specialGemDisabled(key, index)" ng-model="auraGroup[key][index]" value="1" />
    <ng-container ng-if="!item.description">
      {{ item.title }}
    </ng-container>
    <abbr ng-if="item.description" title="{{ item.description }}">
      {{ item.title }}
    </abbr>
    <span class="reserved">{{ reserved[key][index] }}<span ng-if="item.cost!==undefined">%</span></span>
    <div class="cr"></div>
  </label>
</div>`
  }
})
.directive("itemGroup", function() {
  return {
    restrict: 'E',
    template: `
<div class="col-sm-6 col-md-4 itemBlock" ng-class="{ edited: itemGroup[key][index], bm: item.bloodMagic }">
  <label ng-class="{ disabled: itemDisabled(key, index) || specialDisabled(key, index) }">
    <img ng-src="img/{{ key | lowercase | remove_numbers }}.png">
    <input ng-if="item.number" type="number" ng-change="recalc(this)" ng-disabled="itemDisabled(key, index) || specialDisabled(key, index)" ng-model="itemGroup[key][index]" min="0" max="{{ item.max }}" ng-pattern="onlyNumbers" placeholder="num" />
    <input ng-if="!item.number" type="checkbox" ng-change="recalc(this)" ng-disabled="itemDisabled(key, index) || specialDisabled(key, index)" ng-model="itemGroup[key][index]" value="1" />
    <ng-container ng-if="!item.description">
      {{ item.title }}
    </ng-container>
    <abbr ng-if="item.description" title="{{ item.description }}">
      {{ item.title }}
    </abbr>
    <span class="reserved" ng-if="item.number==true">
      <span ng-if="item.multi!==undefined">x{{ multiplier[key][index] }}%</span>
      <span ng-if="item.reduced!==undefined">x{{ 100 - item.reduced[itemGroup[key][index]]}}%<span ng-if="item.special">*</span></span>
    </span>
    <span class="reserved" ng-if="item.number!==true">
      <span ng-if="item.multi!==undefined">x{{ item.multi }}%<span ng-if="item.special">*</span></span>
      <span ng-if="item.less!==undefined && item.less > 0">{{ item.less }}% less<span ng-if="item.special">*</span></span>
      <span ng-if="item.less!==undefined && item.less < 0">{{ item.less * -1 }}% more<span ng-if="item.special">*</span></span>
      <span ng-if="item.reduced!==undefined">x{{ 100 - item.reduced }}%<span ng-if="item.special">*</span></span>
      <span ng-if="item.setTo!==undefined">{{ item.setTo }}%<span ng-if="item.special">*</span></span>
    </span>
    <div class="cr"></div>
  </label>
</div>`
  }
})
.directive("setting", function() {
  return {
    restrict: 'E',
    template: `
<div class="col-sm-6 col-md-4 itemBlock" ng-class="{ edited: settings[key], bm: item.bloodMagic }">
  <label ng-class="{ disabled: {{ item.disabled || false }} || itemDisabled(key) }">
    <img ng-src="img/{{ key | lowercase | remove_numbers }}.png">
    <input type="checkbox" ng-disabled="{{ item.disabled || false }} || itemDisabled(key)" ng-change="recalc(this)" ng-model="settings[key]" value="1" />
    <ng-container ng-if="!item.description">
      {{ item.title }}
    </ng-container>
    <abbr ng-if="item.description" title="{{ item.description }}">
      {{ item.title }}
    </abbr>
    <span class="reserved">
      <span ng-if="item.multi!==undefined">x{{ item.multi }}%<span ng-if="item.special">*</span></span>
      <span ng-if="item.less!==undefined && item.less > 0">{{ item.less }}% less<span ng-if="item.special">*</span></span>
      <span ng-if="item.less!==undefined && item.less < 0">{{ item.less * -1 }}% more<span ng-if="item.special">*</span></span>
      <span ng-if="item.reduced!==undefined">x{{ 100 - item.reduced }}%<span ng-if="item.special">*</span></span>
      <span ng-if="item.setTo!==undefined">{{ item.setTo }}%<span ng-if="item.special">*</span></span>
    </span>
    <div class="cr"></div>
  </label>
</div>`
  }
})
.filter('remove_numbers', function() {
  return function(input) { return input.replace(/[0-9]/g, ''); }
})
