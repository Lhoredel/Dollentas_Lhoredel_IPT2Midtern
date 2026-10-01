import { equipment as initialEquipment } from "../data/mockData";

const STORAGE_KEY = "labtrackEquipment";

function read() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : initialEquipment;
}

function write(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const equipmentService = {
  async getAll() {
    await new Promise((resolve) => setTimeout(resolve, 450));
    return read();
  },

  async getById(id) {
    const items = read();
    return items.find((item) => item.id === Number(id)) || null;
  },

  async create(payload) {
    const items = read();
    const item = {
      ...payload,
      id: Date.now(),
      quantity: Number(payload.quantity),
    };
    write([item, ...items]);
    return item;
  },

  async update(id, payload) {
    const items = read();
    const updated = items.map((item) =>
      item.id === Number(id)
        ? { ...item, ...payload, quantity: Number(payload.quantity) }
        : item
    );
    write(updated);
    return updated.find((item) => item.id === Number(id));
  },

  async remove(id) {
    const items = read().filter((item) => item.id !== Number(id));
    write(items);
  },

  reset() {
    write(initialEquipment);
  },
};