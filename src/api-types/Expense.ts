export default interface Expense {
    uuid: string;
    id: number;
    title: string;
    amount: string;
    expense_paid_at: string;
    group_id: number;
    member_id: number;
    created_at: string;
    member_name: string;
}
