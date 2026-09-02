export function validateEmail(email: string): boolean {
    const testEmail =
    /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return testEmail.test(email);
}