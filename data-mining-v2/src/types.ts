import { ReactNode } from "react";

export interface AuthorText {
    title: ReactNode;
    filename: string;
    content: string;
    tags: string[];
  }
  