
export interface Message {
  role: "IA" | "user";
  text: string;
  timestamp: number;
}
