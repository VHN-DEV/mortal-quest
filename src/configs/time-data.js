import { HOURS_ENUM, SEASONS_ENUM, PHENOMENA_ENUM } from './game-enums.js';

export const HOURS = Object.values(HOURS_ENUM).map(q => ({
    id: q.id,
    name: q.name,
    period: q.period,
    description: q.description
}));

export const SEASONS = Object.values(SEASONS_ENUM).map(q => ({
    id: q.id,
    name: q.name,
    color: q.color,
    bonus: q.bonus,
    description: q.description
}));

export const PHENOMENA = Object.values(PHENOMENA_ENUM).map(q => ({
    id: q.id,
    name: q.name,
    chance: q.chance,
    duration: q.duration,
    effect: q.effect,
    description: q.description
}));
