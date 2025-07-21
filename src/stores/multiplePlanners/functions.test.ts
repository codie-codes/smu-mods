import { expect } from "@jest/globals";

import { ModuleBank } from "@/types/banks/moduleBank";
import {
  defaultPlanner,
  defaultPlannerState,
  Term,
  Year,
} from "@/types/planner";
import { ModuleCode, ModuleForPlanner } from "@/types/primitives/module";

import { MultiplePlanner, PlannerFull } from ".";
import {
  addModule,
  addPlanner,
  changePlannerName,
  changeTerm,
  hideSpecial,
  removeModule,
  removePlanner,
  update,
} from "./functions";

describe("multiplePlanners functions", () => {
  let mockModuleBank: ModuleBank;
  let mockModule1: ModuleForPlanner;
  let mockModule2: ModuleForPlanner;
  let mockPlanners: MultiplePlanner;

  beforeEach(() => {
    mockModule1 = {
      name: "Introduction to Computer Science",
      moduleCode: "CS101" as ModuleCode,
      description: "Basic CS concepts",
      credit: 4,
      terms: ["Term 1", "Term 2"] as Term[],
      coRequisite: [],
      mutuallyExclusive: [],
    };

    mockModule2 = {
      name: "Data Structures",
      moduleCode: "CS201" as ModuleCode,
      description: "Data structures and algorithms",
      credit: 4,
      terms: ["Term 1", "Term 2"] as Term[],
      coRequisite: [],
      mutuallyExclusive: [],
    };

    mockModuleBank = {
      CS101: mockModule1 as any,
      CS201: mockModule2 as any,
    };

    mockPlanners = {
      planner0: {
        name: "Test Planner",
        plannerState: {
          ...defaultPlannerState,
          modules: {
            CS101: {
              year: "1" as Year,
              term: "Term 1" as Term,
              module: mockModule1,
            },
          },
        },
        planner: defaultPlanner,
        isSpecialHidden: {
          1: false,
          2: false,
          3: false,
          4: false,
        },
      },
    };
  });

  describe("update", () => {
    it("should update modules that have moduleCode but no module property", () => {
      const plannersWithCodeOnly = {
        planner0: {
          ...mockPlanners.planner0,
          plannerState: {
            ...mockPlanners.planner0.plannerState,
            modules: {
              CS101: {
                year: "1" as Year,
                term: "Term 1" as Term,
                moduleCode: "CS101" as ModuleCode,
              } as any,
            },
          },
        },
      };

      const result = update(plannersWithCodeOnly, mockModuleBank);

      expect(result.planner0.plannerState.modules["CS101"]).not.toHaveProperty(
        "module",
      );
      expect(result.planner0.plannerState.modules["CS101"]).toHaveProperty(
        "moduleCode",
      );
    });

    it("should return original planners if no changes needed", () => {
      const result = update(mockPlanners, mockModuleBank);
      expect(result).toBe(mockPlanners);
    });
  });

  describe("addModule", () => {
    it("should add a new module to the planner", () => {
      const result = addModule(
        mockPlanners,
        "CS201" as ModuleCode,
        { id: "test-id", year: "2" as Year, term: "Term 1" as Term },
        mockModuleBank,
        "planner0",
      );

      expect(result.planner0.plannerState.modules["CS201"]).toEqual({
        year: "2",
        term: "Term 1",
        module: mockModule2,
      });
      expect(result.planner0.plannerState.modules["CS101"]).toEqual(
        mockPlanners.planner0.plannerState.modules["CS101"],
      );
    });

    it("should not add module if it already exists", () => {
      const result = addModule(
        mockPlanners,
        "CS101" as ModuleCode,
        { id: "test-id", year: "2" as Year, term: "Term 1" as Term },
        mockModuleBank,
        "planner0",
      );

      expect(result).toBe(mockPlanners);
    });

    it("should return original planners if planner doesn't exist", () => {
      const result = addModule(
        mockPlanners,
        "CS201" as ModuleCode,
        { id: "test-id", year: "2" as Year, term: "Term 1" as Term },
        mockModuleBank,
        "nonexistent",
      );

      expect(result).toBe(mockPlanners);
    });
  });

  describe("changeTerm", () => {
    it("should move module to new term", () => {
      const result = changeTerm(
        mockPlanners,
        "1" as Year,
        "Term 1" as Term,
        "2" as Year,
        "Term 2" as Term,
        "CS101" as ModuleCode,
        "planner0",
      );

      expect(result.planner0.plannerState.modules["CS101"]).toEqual({
        year: "2",
        term: "Term 2",
        module: mockModule1,
      });
    });

    it("should return original planners if planner doesn't exist", () => {
      const result = changeTerm(
        mockPlanners,
        "1" as Year,
        "Term 1" as Term,
        "2" as Year,
        "Term 2" as Term,
        "CS101" as ModuleCode,
        "nonexistent",
      );

      expect(result).toBe(mockPlanners);
    });

    it("should return original planners if module doesn't exist", () => {
      const result = changeTerm(
        mockPlanners,
        "1" as Year,
        "Term 1" as Term,
        "2" as Year,
        "Term 2" as Term,
        "CS999" as ModuleCode,
        "planner0",
      );

      expect(result).toBe(mockPlanners);
    });
  });

  describe("removeModule", () => {
    it("should remove module from planner", () => {
      const result = removeModule(
        mockPlanners,
        "CS101" as ModuleCode,
        "1" as Year,
        "Term 1" as Term,
        "planner0",
      );

      expect(result.planner0.plannerState.modules).not.toHaveProperty("CS101");
    });

    it("should return original planners if planner doesn't exist", () => {
      const result = removeModule(
        mockPlanners,
        "CS101" as ModuleCode,
        "1" as Year,
        "Term 1" as Term,
        "nonexistent",
      );

      expect(result).toBe(mockPlanners);
    });

    it("should return original planners if module doesn't exist", () => {
      const result = removeModule(
        mockPlanners,
        "CS999" as ModuleCode,
        "1" as Year,
        "Term 1" as Term,
        "planner0",
      );

      expect(result).toBe(mockPlanners);
    });
  });

  describe("hideSpecial", () => {
    it("should toggle special hidden state for a year", () => {
      const result = hideSpecial(mockPlanners, "1" as Year, "planner0");

      expect(result.planner0.isSpecialHidden["1"]).toBe(true);
    });

    it("should toggle back to false when called again", () => {
      const plannerWithHiddenYear = {
        ...mockPlanners,
        planner0: {
          ...mockPlanners.planner0,
          isSpecialHidden: {
            ...mockPlanners.planner0.isSpecialHidden,
            1: true,
          },
        },
      };

      const result = hideSpecial(
        plannerWithHiddenYear,
        "1" as Year,
        "planner0",
      );

      expect(result.planner0.isSpecialHidden["1"]).toBe(false);
    });

    it("should return original planners if planner doesn't exist", () => {
      const result = hideSpecial(mockPlanners, "1" as Year, "nonexistent");

      expect(result).toBe(mockPlanners);
    });
  });

  describe("changePlannerName", () => {
    it("should change planner name", () => {
      const result = changePlannerName(mockPlanners, "planner0", "New Name");

      expect(result.planner0.name).toBe("New Name");
      expect(result.planner0.plannerState).toBe(
        mockPlanners.planner0.plannerState,
      );
    });

    it("should return original planners if planner doesn't exist", () => {
      const result = changePlannerName(mockPlanners, "nonexistent", "New Name");

      expect(result).toBe(mockPlanners);
    });
  });

  describe("removePlanner", () => {
    it("should remove planner from planners object", () => {
      const result = removePlanner(mockPlanners, "planner0");

      expect(result).not.toHaveProperty("planner0");
      expect(Object.keys(result)).toHaveLength(0);
    });

    it("should not affect other planners", () => {
      const multiPlanners = {
        ...mockPlanners,
        planner1: {
          ...mockPlanners.planner0,
          name: "Second Planner",
        },
      };

      const result = removePlanner(multiPlanners, "planner0");

      expect(result).not.toHaveProperty("planner0");
      expect(result).toHaveProperty("planner1");
      expect(result.planner1.name).toBe("Second Planner");
    });
  });

  describe("addPlanner", () => {
    it("should add new planner with default values", () => {
      const result = addPlanner(mockPlanners, "New Planner");

      expect(result).toHaveProperty("planner1");
      expect(result.planner1.name).toBe("New Planner");
      expect(result.planner1.plannerState).toEqual(defaultPlannerState);
      expect(result.planner1.planner).toEqual(defaultPlanner);
      expect(result.planner1.isSpecialHidden).toEqual({
        1: false,
        2: false,
        3: false,
        4: false,
      });
    });

    it("should add planner with provided plannerFull data", () => {
      const customPlannerFull: Omit<PlannerFull, "name"> = {
        plannerState: {
          ...defaultPlannerState,
          modules: {
            CS201: {
              year: "2" as Year,
              term: "Term 1" as Term,
              module: mockModule2,
            },
          },
        },
        planner: defaultPlanner,
        isSpecialHidden: {
          1: true,
          2: false,
          3: false,
          4: false,
        },
      };

      const result = addPlanner(
        mockPlanners,
        "Custom Planner",
        customPlannerFull,
      );

      expect(result).toHaveProperty("planner1");
      expect(result.planner1.name).toBe("Custom Planner");
      expect(result.planner1.plannerState.modules).toHaveProperty("CS201");
      expect(result.planner1.isSpecialHidden["1"]).toBe(true);
    });

    it("should generate correct planner ID based on existing planners count", () => {
      const multiPlanners = {
        ...mockPlanners,
        planner1: { ...mockPlanners.planner0, name: "Second" },
        planner2: { ...mockPlanners.planner0, name: "Third" },
      };

      const result = addPlanner(multiPlanners, "Fourth Planner");

      expect(result).toHaveProperty("planner3");
    });
  });
});
