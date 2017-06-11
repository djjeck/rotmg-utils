const Stat = {
  ATT: 1,
  SPD: 2,
  DEF: 3,
  DEX: 4,
  VIT: 5,
  WIS: 6,
  LIFE: 7,
  MANA: 8,
};

const Tier = {
  T7: 7,
  T8: 8,
  T9: 9,
};

const ItemType = {
  ARMOR: 1,
  WEAPON: 2,
};

const ArmorType = {
  LEATHER: 1,
  ROBE: 2,
  HEAVY: 3,
};

const WeaponType = {
  DAGGER: 1,
  BOW: 2,
  STAFF: 3,
  WAND: 4,
  SWORD: 5,
  KATANA: 6,
};

class Item {
}

class Equipment extends Item {
  constructor(tier) {
    super();
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
  constructor(tier, itemClass) {
    super(tier);
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
  constructor(tier, itemClass) {
    super(tier);
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
  constructor() {
    super();
  }
}

class StatPot extends Consumable {
  constructor(stat) {
    super();
    this.stat = stat;
  }
  
  getKey() {
    switch (this.stat) {
      case Stat.ATT: return 'att';
      case Stat.SPD: return 'spd';
      case Stat.DEF: return 'def';
      case Stat.DEX: return 'dex';
      case Stat.VIT: return 'vit';
      case Stat.WIS: return 'wis';
      case Stat.LIFE: return 'life';
      case Stat.MANA: return 'mana';
      default: throw `Invalid stat: ${this.stat}`;
    }
  }
  
  getImage() {
    return keys.getImagePath(`stat-pot-${this.getKey()}`);
  }
}

class Boost extends Consumable {
  constructor(name) {
    super();
    this.name = name;
  }
  
  getImage() {
    return keys.getImagePath(this.name);
  }
}
