import { Request, Response } from "express";

export const listBookLoans = (request: Request, response: Response) => {
    const lendings = [
        {
            id: "cf93597d",
            name: "Código Limpo (Clean Code)",
            author: "Robert Cecil Martin",
            publicationYear: "2012",
        }
    ]
    response.json(lendings)
}