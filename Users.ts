export interface User {
    id: number
    name: string
    email: string
    password: string
    note?: string
}

export default new class Users {
    users: User[] = [
        {
            id: 1,
            name: 'a',
            email: 'a@a',
            password: "a",
            note: 'this is a test'
        }
    ];

    getUserById = (id) => this.users[0]
}

