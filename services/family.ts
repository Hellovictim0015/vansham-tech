import { Person, Relationship, FamilyGraph } from "@/types/family-v2";

const MOCK_DELAY = 500;

// Simulating database
const mockPeople: Record<string, Person> = {
  "1": {
    id: "1",
    name: "Ramesh Gupta",
    gender: "male",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh",
    metadata: { isAlive: true, gotra: "Kashyap", nativePlace: "Varanasi" },
  },
  "2": {
    id: "2",
    name: "Kamla Gupta",
    gender: "female",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamla",
    metadata: { isAlive: true, nativePlace: "Lucknow" },
  },
  "3": {
    id: "3",
    name: "Rajesh Gupta",
    gender: "male",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
    metadata: { isAlive: true },
  },
};

const mockRelationships: Relationship[] = [
  { id: "r1", fromId: "1", toId: "2", type: "spouse" }, // Ramesh - Kamla
  { id: "r2", fromId: "1", toId: "3", type: "father" }, // Ramesh -> Rajesh
  { id: "r3", fromId: "2", toId: "3", type: "mother" }, // Kamla -> Rajesh
];

export const fetchFamilyTree = async (): Promise<FamilyGraph> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nodes: { ...mockPeople },
        edges: [...mockRelationships],
      });
    }, MOCK_DELAY);
  });
};

export const addMember = async (person: Person): Promise<Person> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockPeople[person.id] = person;
      resolve(person);
    }, MOCK_DELAY);
  });
};

export const addRelationship = async (
  relationship: Relationship,
): Promise<Relationship> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockRelationships.push(relationship);
      resolve(relationship);
    }, MOCK_DELAY);
  });
};
