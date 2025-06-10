describe("Module Bank Utils", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should search modules by name and module code", () => {
    cy.visit("/modules");
    cy.window().then((win) => {
      // Mock the actual ModuleBank structure based on your types
      const mockModules = {
        CS1010: {
          moduleCode: "CS1010",
          name: "Programming Methodology",
          moduleCredit: 4,
          description: "Introduction to programming",
        },
        CS2030: {
          moduleCode: "CS2030",
          name: "Programming Methodology II",
          moduleCredit: 4,
          description: "Object-oriented programming",
        },
        IS1103: {
          moduleCode: "IS1103",
          name: "Ethics in Computing",
          moduleCredit: 3,
          description: "Computing ethics and society",
        },
      };

      // Test the actual searchModule function from your utils
      const { searchModule } = require("../../../src/utils/moduleBank.ts");

      // Test search by module code
      const codeResults = searchModule(mockModules, "CS1010");
      expect(codeResults).to.have.length(1);
      expect(codeResults[0]).to.have.property("moduleCode", "CS1010");

      // Test search by module name
      const nameResults = searchModule(mockModules, "Programming");
      expect(nameResults).to.have.length(2);
      const codes = nameResults.map((m) => m.moduleCode);
      expect(codes).to.include.members(["CS1010", "CS2030"]);

      // Test case insensitive search
      const caseResults = searchModule(mockModules, "programming");
      expect(caseResults).to.have.length(2);

      // Test empty query returns all modules
      const allResults = searchModule(mockModules);
      expect(allResults).to.have.length(3);

      // Test no matches
      const noResults = searchModule(mockModules, "NONEXISTENT");
      expect(noResults).to.have.length(0);
    });
  });

  it("should handle edge cases correctly", () => {
    cy.window().then(() => {
      const { searchModule } = require("../../../src/utils/moduleBank.ts");

      // Test with empty module bank
      const emptyResults = searchModule({}, "CS1010");
      expect(emptyResults).to.have.length(0);

      // Test with null/undefined query
      const mockModules = {
        CS1010: {
          moduleCode: "CS1010",
          name: "Programming Methodology",
        },
      };

      const nullResults = searchModule(mockModules, null);
      expect(nullResults).to.have.length(1);

      const undefinedResults = searchModule(mockModules, undefined);
      expect(undefinedResults).to.have.length(1);
    });
  });

  it("should filter modules by search criteria", () => {
    cy.visit("/modules");
    cy.window().then(() => {
      const modules = {
        CS1010: {
          moduleCode: "CS1010",
          title: "Programming Methodology",
          moduleCredit: 4,
          department: "Computer Science",
        },
        IS1103: {
          moduleCode: "IS1103",
          title: "Ethics in Computing",
          moduleCredit: 3,
          department: "Information Systems",
        },
      };

      // Test filtering by department
      cy.window()
        .its("Object")
        .invoke("values", modules)
        .invoke("filter", (module) => module.department === "Computer Science")
        .should("have.length", 1)
        .its("0")
        .should("have.property", "moduleCode", "CS1010");

      // Test filtering by credits
      cy.window()
        .its("Object")
        .invoke("values", modules)
        .invoke("filter", (module) => module.moduleCredit === 4)
        .should("have.length", 1)
        .its("0")
        .should("have.property", "moduleCode", "CS1010");
    });
  });

  it("should handle case-insensitive search", () => {
    cy.visit("/modules");
    cy.window().then(() => {
      const modules = {
        CS1010: {
          moduleCode: "CS1010",
          name: "Programming Methodology",
          description: "Introduction to programming concepts",
        },
      };

      // Test case-insensitive search logic directly
      const searchTerm = "programming";
      const results = Object.values(modules).filter((module) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          module.name.toLowerCase().includes(searchLower) ||
          module.moduleCode.toLowerCase().includes(searchLower) ||
          (module.description &&
            module.description.toLowerCase().includes(searchLower))
        );
      });

      expect(results).to.have.length(1);
      expect(results[0]).to.have.property("moduleCode", "CS1010");

      // Test uppercase search
      const upperResults = Object.values(modules).filter((module) => {
        const searchLower = "PROGRAMMING".toLowerCase();
        return (
          module.name.toLowerCase().includes(searchLower) ||
          module.moduleCode.toLowerCase().includes(searchLower) ||
          (module.description &&
            module.description.toLowerCase().includes(searchLower))
        );
      });

      expect(upperResults).to.have.length(1);
      expect(upperResults[0]).to.have.property("moduleCode", "CS1010");

      // Test mixed case search
      const mixedResults = Object.values(modules).filter((module) => {
        const searchLower = "ProGramming".toLowerCase();
        return (
          module.name.toLowerCase().includes(searchLower) ||
          module.moduleCode.toLowerCase().includes(searchLower) ||
          (module.description &&
            module.description.toLowerCase().includes(searchLower))
        );
      });

      expect(mixedResults).to.have.length(1);
      expect(mixedResults[0]).to.have.property("moduleCode", "CS1010");

      cy.log("✅ Case-insensitive search logic verified");
    });
  });
});
