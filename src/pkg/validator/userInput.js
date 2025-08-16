export function validateProjectInput({title, description, status, budgetMin, budgetMax}) {
    if (!title) {
        return `project title is required`;
    }
    if (!description) {
        return `project description is required`;
    }
    if (!budgetMax || !budgetMin) {
        return `project budget is required`;
    }
    return null;
}

export function validateUserInput({name, email, password}) {
    if (!name) {
        return `name is required`;
    }
    if (!email) {
        return `email is required`;
    }
    if (!password) {
        return `passwords is required`;
    }
    return null
}