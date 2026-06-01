import { describe, it, expect, vi, beforeEach } from 'vitest';
import { utf8_to_hex, hex_to_utf8, SaveSystem } from '../src/core/save-system.js';

// Mock localforage
const store = {};
vi.mock('localforage', () => {
  return {
    default: {
      config: vi.fn(),
      setItem: vi.fn(async (key, value) => {
        store[key] = value;
        return value;
      }),
      getItem: vi.fn(async (key) => {
        return store[key] || null;
      }),
      removeItem: vi.fn(async (key) => {
        delete store[key];
      }),
      clear: vi.fn(async () => {
        for (const key in store) {
          delete store[key];
        }
      })
    }
  };
});

describe('SaveSystem Helpers - Hex & UTF-8 conversion', () => {
  it('should convert UTF-8 string to Hex representation correctly', () => {
    const original = 'Phàm Nhân Tu Tiên 123!';
    const hex = utf8_to_hex(original);
    
    expect(hex).toBeTypeOf('string');
    expect(hex).toMatch(/^[0-9A-F]+$/); // Hex values should be uppercase as per utf8_to_hex
  });

  it('should decode Hex representation back to original UTF-8 string correctly', () => {
    const original = 'Chào mừng đạo hữu tới thế giới tu chân!';
    const hex = utf8_to_hex(original);
    const decoded = hex_to_utf8(hex);
    
    expect(decoded).toBe(original);
  });

  it('should handle empty strings and special characters', () => {
    const original = '☯🔥🛡️⚔️';
    const hex = utf8_to_hex(original);
    const decoded = hex_to_utf8(hex);
    
    expect(decoded).toBe(original);
  });
});

describe('SaveSystem Core - Save, Load, Metadata', () => {
  beforeEach(async () => {
    // Reset our mock store before each test
    for (const key in store) {
      delete store[key];
    }
  });

  it('should save and load slot data correctly', async () => {
    const mockData = { name: 'Làn Gió Đông', level: 10, tuVi: 50000 };
    const success = await SaveSystem.save(1, mockData, { name: 'Làn Gió Đông', realm: 'Luyện Khí Kỳ' });
    
    expect(success).toBe(true);
    
    const loadedData = await SaveSystem.load(1);
    expect(loadedData).toEqual(mockData);
  });

  it('should manage last slot used correctly', async () => {
    await SaveSystem.setLastSlot(3);
    const lastSlot = await SaveSystem.getLastSlot();
    
    expect(lastSlot).toBe(3);
  });

  it('should return null when loading empty slot', async () => {
    const loaded = await SaveSystem.load(99);
    expect(loaded).toBeNull();
  });

  it('should rename save metadata correctly', async () => {
    const mockData = { name: 'Cự Nhạc' };
    const metadata = { name: 'Cự Nhạc', level: 5 };
    
    await SaveSystem.save(2, mockData, metadata);
    const success = await SaveSystem.renameSave(2, 'Cự Nhạc Tông Chủ');
    
    expect(success).toBe(true);
    
    const allMetadata = await SaveSystem.getAllMetadata();
    expect(allMetadata[2].name).toBe('Cự Nhạc Tông Chủ');
  });

  it('should delete saves and update metadata accordingly', async () => {
    const mockData = { name: 'Thế Lực Ma Đạo' };
    const metadata = { name: 'Thế Lực Ma Đạo', level: 50 };
    
    await SaveSystem.save(4, mockData, metadata);
    
    let allMeta = await SaveSystem.getAllMetadata();
    expect(allMeta[4]).toBeDefined();
    
    await SaveSystem.deleteSave(4);
    
    const loadedData = await SaveSystem.load(4);
    expect(loadedData).toBeNull();
    
    allMeta = await SaveSystem.getAllMetadata();
    expect(allMeta[4]).toBeUndefined();
  });
});
