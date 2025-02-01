describe("timetable", () => {
  it("should access the timetable for term 1", () => {
    cy.visit("http://localhost:3000/timetable/term-1");
  });

  it("should access the timetable for term 2", () => {
    cy.visit("http://localhost:3000/timetable/term-2");
  });

  it("should access the timetable for term 3a", () => {
    cy.visit("http://localhost:3000/timetable/term-3a");
  });

  it("should access the timetable for term 3b", () => {
    cy.visit("http://localhost:3000/timetable/term-3b");
  });
});
