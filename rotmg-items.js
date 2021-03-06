function makeEnum(names) {
  const obj = {};
  const values = [];
  const strings = {};
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const value = i + 1;
    obj[name] = value; // Avoid 0, which might be mistaken with undefined
    values.push(value);
    strings[value] = name.toLowerCase();
  }
  obj.values = () => values;
  obj.toString = value => {
    if (!value || !strings[value])
      throw `Enum ${value} not found.`;
    return strings[value];
  }
  return obj;
}

const Stat = makeEnum(['VIT', 'SPD', 'DEF', 'DEX', 'VIT', 'WIS', 'LIFE', 'MANA']);
const Tier = makeEnum(['T7', 'T8', 'T9']);
const ItemType = makeEnum(['ARMOR', 'WEAPON']);
const ArmorType = makeEnum(['LEATHER', 'ROBE', 'HEAVY']);
const WeaponType = makeEnum(['DAGGER', 'BOW', 'STAFF', 'WAND', 'SWORD', 'KATANA']);

class Item {
  constructor(info = {}) {
    this.info = info;
  }
  
  getInfo() {
    return this.info;
  }
}

class Equipment extends Item {
  constructor(tier, info) {
    super(info);
    this.tier = tier;
  }
  
  getTier() {
    return this.tier;
  }
  
  toString() {
    const key = this.getQuantityKey();
    return `[Item ${key}]`;
  }
  
  // abstract getItemType()
  
  // abstract getItemClass()
  
  getQuantityKey() {
    return keys.makeItemQuantityKey(this.tier, this.getItemType(), this.getItemClass());
  }
  
  getImage() {
    const imageKey = keys.makeItemImageKey(this.tier, this.getItemType(), this.getItemClass());
    return keys.getImagePath(imageKey);
  }
}

class Armor extends Equipment {
  constructor(tier, itemClass, info) {
    super(tier, info);
    this.itemClass = itemClass;
  }
  
  getItemType() {
    return ItemType.ARMOR;
  }
  
  getItemClass() {
    return this.itemClass;
  }
}

class Weapon extends Equipment {
  constructor(tier, itemClass, info) {
    super(tier, info);
    this.itemClass = itemClass;
  }
  
  getItemType() {
    return ItemType.WEAPON;
  }
  
  getItemClass() {
    return this.itemClass;
  }
}

class Consumable extends Item {
  constructor(info) {
    super(info);
  }
}

class StatPot extends Consumable {
  constructor(stat, info) {
    super(info);
    this.stat = stat;
  }
  
  getKey() {
    return Stat.toString(this.stat);
  }
  
  getImage() {
    return keys.getImagePath(`stat-pot-${this.getKey()}`);
  }
}

class Boost extends Consumable {
  constructor(name, info) {
    super(info);
    this.name = name;
  }
  
  getImage() {
    return keys.getImagePath(this.name);
  }
}
