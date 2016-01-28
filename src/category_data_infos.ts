function yesNo(e:boolean):string {
    "use strict";

    return e ? "Yes" : "No";
}

function listEntries(e:any[]):string {
    "use strict";

    let result:string;
    for (let i:number = 0; i < e.length; i++) {
        if (i === 0) {
            result = e[i];
        } else {
            result += ", " + e[i];
        }
    }
    return result;
}

let ENERGY_SOURCE_W_EMISSIONS:any = {
    "emissions": "Emissions",
    "type": "Energy type",
    "usage_priority": "Energy priority",
};

let ENERGY_SOURCE:any = {
    "type": "Energy type",
    "usage_priority": "Energy priority",
};

export function getCategories():any {
    "use strict";

    return {
        "accumulator": {
            "name": "Accumulators",
            "info": {
                "charge_cooldown": "Charge CD",
                "discharge_cooldown": "Discharge CD",
                "energy_source": {
                    "input_flow_limit": "Input limit",
                    "type": "Type",
                    "buffer_capacity": "Capacity",
                    "usage_priority": "Use priority",
                    "output_flow_limit": "Output limit",
                },
            },
        },
        "active-defense-equipment": {
            "name": "active-defense-equipment",
            "info": {},
        },
        "ammo": {
            "name": "ammo",
            "info": {},
        },
        "ammo-category": {
            "name": "ammo-category",
            "info": {},
        },
        "ammo-turret": {
            "name": "ammo-turret",
            "info": {},
        },
        "armor": {
            "name": "armor",
            "info": {},
        },
        "arrow": {
            "name": "arrow",
            "info": {},
        },
        "assembling-machine": {
            "name": "Assembling Machines",
            "info": {
                "crafting_categories": ["Crafting Categories", listEntries],
                "crafting_speed": "Crafting Speed",
                "energy_source": ENERGY_SOURCE_W_EMISSIONS,
                "energy_usage": "Energy Usage",
                "ingredient_count": "Ingredient Count",
            },
        },
        "autoplace-control": {
            "name": "autoplace-control",
            "info": {},
        },
        "battery-equipment": {
            "name": "battery-equipment",
            "info": {},
        },
        "beacon": {
            "name": "beacon",
            "info": {},
        },
        "blueprint": {
            "name": "blueprint",
            "info": {},
        },
        "boiler": {
            "name": "Steam Boilers",
            "info": {
                "burner": {
                    "effectivity": "Effectiveness",
                    "emissions": "Emissions",
                },
                "burning_cooldown": "Burning CD",
                "energy_consumption": "Energy Consumption",
            },
        },
        "capsule": {
            "name": "capsule",
            "info": {},
        },
        "car": {
            "name": "car",
            "info": {},
        },
        "cargo-wagon": {
            "name": "cargo-wagon",
            "info": {},
        },
        "combat-robot": {
            "name": "combat-robot",
            "info": {},
        },
        "construction-robot": {
            "name": "construction-robot",
            "info": {},
        },
        "container": {
            "name": "container",
            "info": {},
        },
        "corpse": {
            "name": "corpse",
            "info": {},
        },
        "damage-type": {
            "name": "damage-type",
            "info": {},
        },
        "deconstruction-item": {
            "name": "deconstruction-item",
            "info": {},
        },
        "decorative": {
            "name": "decorative",
            "info": {},
        },
        "electric-pole": {
            "name": "electric-pole",
            "info": {},
        },
        "electric-turret": {
            "name": "electric-turret",
            "info": {},
        },
        "energy-shield-equipment": {
            "name": "energy-shield-equipment",
            "info": {},
        },
        "explosion": {
            "name": "explosion",
            "info": {},
        },
        "fish": {
            "name": "fish",
            "info": {},
        },
        "flame-thrower-explosion": {
            "name": "flame-thrower-explosion",
            "info": {},
        },
        "fluid": {
            "name": "fluid",
            "info": {},
        },
        "flying-text": {
            "name": "flying-text",
            "info": {},
        },
        "font": {
            "name": "font",
            "info": {},
        },
        "furnace": {
            "name": "Furnaces",
            "info": {
                "crafting_categories": ["Crafting Categories", listEntries],
                "crafting_speed": "Crafting Speed",
                "energy_source": ENERGY_SOURCE,
                "energy_usage": "Energy Usage",
                "ingredient_count": "Ingredient Count",
                "module_slots": "Module Slots",
            },
        },
        "gate": {
            "name": "gate",
            "info": {},
        },
        "generator": {
            "name": "Generators",
            "info": {
                "effectivity": "Effectivity",
                "energy_source": ENERGY_SOURCE,
                "fluid_usage_per_tick": "Fluid Usage Per Tick",
                "min_perceived_performance": "Min Perceived Performance",
            },
        },
        "generator-equipment": {
            "name": "generator-equipment",
            "info": {},
        },
        // "ghost": {
        //    "name": "ghost",
        //    "info": {
        //
        //    }
        // },
        "gui-style": {
            "name": "gui-style",
            "info": {},
        },
        "gun": {
            "name": "gun",
            "info": {},
        },
        "inserter": {
            "name": "inserter",
            "info": {},
        },
        "item": {
            "name": "item",
            "info": {},
        },
        "item-entity": {
            "name": "item-entity",
            "info": {},
        },
        "item-group": {
            "name": "item-group",
            "info": {},
        },
        "item-subgroup": {
            "name": "item-subgroup",
            "info": {},
        },
        "lab": {
            "name": "lab",
            "info": {},
        },
        "lamp": {
            "name": "lamp",
            "info": {},
        },
        "land-mine": {
            "name": "land-mine",
            "info": {},
        },
        "locomotive": {
            "name": "locomotive",
            "info": {},
        },
        "logistic-container": {
            "name": "logistic-container",
            "info": {},
        },
        "logistic-robot": {
            "name": "logistic-robot",
            "info": {},
        },
        "map-settings": {
            "name": "map-settings",
            "info": {},
        },
        "market": {
            "name": "market",
            "info": {},
        },
        "mining-drill": {
            "name": "Mining Drills",
            "info": {
                "energy_source": {
                    "emissions": "Emissions",
                    "type": "Energy type",
                    "usage_priority": "Energy priority",
                },
                "energy_usage": "Energy usage",
                "mining_power": "Mining power",
                "mining_speed": "Mining speed",
                "module_slots": "Module slots",
                "resource_categories": ["Resource Categories", listEntries],
                "resource_searching_radius": "Radius",
            },
        },
        "mining-tool": {
            "name": "mining-tool",
            "info": {},
        },
        "module": {
            "name": "module",
            "info": {},
        },
        "movement-bonus-equipment": {
            "name": "movement-bonus-equipment",
            "info": {},
        },
        "night-vision-equipment": {
            "name": "night-vision-equipment",
            "info": {},
        },
        "noise-layer": {
            "name": "noise-layer",
            "info": {},
        },
        "offshore-pump": {
            "name": "offshore-pump",
            "info": {},
        },
        "particle": {
            "name": "particle",
            "info": {},
        },
        "particle-source": {
            "name": "particle-source",
            "info": {},
        },
        "pipe": {
            "name": "pipe",
            "info": {},
        },
        "pipe-to-ground": {
            "name": "pipe-to-ground",
            "info": {},
        },
        "player": {
            "name": "player",
            "info": {},
        },
        "player-port": {
            "name": "player-port",
            "info": {},
        },
        "projectile": {
            "name": "projectile",
            "info": {},
        },
        "pump": {
            "name": "pump",
            "info": {},
        },
        "radar": {
            "name": "radar",
            "info": {},
        },
        // "rail": {
        //    "name": "rail",
        //    "info": {
        //
        //    }
        // },
        "rail-category": {
            "name": "rail-category",
            "info": {},
        },
        "rail-remnants": {
            "name": "rail-remnants",
            "info": {},
        },
        "rail-signal": {
            "name": "rail-signal",
            "info": {},
        },
        "recipe": {
            "name": "recipe",
            "info": {},
        },
        "recipe-category": {
            "name": "recipe-category",
            "info": {},
        },
        "repair-tool": {
            "name": "repair-tool",
            "info": {},
        },
        "resource": {
            "name": "Resources",
            "info": {
                "category": "Category",
                "infinite": ["Infinite", yesNo],
                "minable": {
                    "hardness": "Hardness",
                    "mining_time": "Mining time",
                },
                "minimum": "Minimum",
                "normal": "Normal",
                "map_color": [
                    "Map color",
                    function (e:{r:number, g:number, b:number}):string {
                        let hexColor:string = Number(0x1000000 + Math.round(e.r * 255) * 0x10000 + Math.round(e.g * 255) * 0x100 + Math.round(e.b * 255)).toString(16).substring(1).toUpperCase();

                        return "<div class=\"cat-resource-color\" style=\"background: #" + hexColor + "\"></div>&nbsp;#" + hexColor;
                    },
                    true, // raw
                ],
            },
        },
        "resource-category": {
            "name": "resource-category",
            "info": {},
        },
        "roboport": {
            "name": "roboport",
            "info": {},
        },
        "rocket-defense": {
            "name": "rocket-defense",
            "info": {},
        },
        "simple-entity": {
            "name": "simple-entity",
            "info": {},
        },
        "smart-container": {
            "name": "smart-container",
            "info": {},
        },
        "smoke": {
            "name": "smoke",
            "info": {},
        },
        "solar-panel": {
            "name": "Solar Panels",
            "info": {
                "energy_source": ENERGY_SOURCE,
                "production": "Production",
            },
        },
        "solar-panel-equipment": {
            "name": "solar-panel-equipment",
            "info": {},
        },
        "splitter": {
            "name": "splitter",
            "info": {},
        },
        "sticker": {
            "name": "sticker",
            "info": {},
        },
        "storage-tank": {
            "name": "storage-tank",
            "info": {},
        },
        "technology": {
            "name": "technology",
            "info": {},
        },
        "tile": {
            "name": "tile",
            "info": {},
        },
        "train-stop": {
            "name": "train-stop",
            "info": {},
        },
        "transport-belt": {
            "name": "transport-belt",
            "info": {},
        },
        "transport-belt-to-ground": {
            "name": "transport-belt-to-ground",
            "info": {},
        },
        "tree": {
            "name": "tree",
            "info": {},
        },
        "turret": {
            "name": "turret",
            "info": {},
        },
        "unit": {
            "name": "unit",
            "info": {},
        },
        "unit-spawner": {
            "name": "unit-spawner",
            "info": {},
        },
        "wall": {
            "name": "wall",
            "info": {},
        },
    };
}
