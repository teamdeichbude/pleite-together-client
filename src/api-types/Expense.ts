export default interface Expense {
    uuid: string;
    id: number;
    title: string;
    amount: number;
    expense_paid_at: string;
    group_id: number;
    member_id: number;
    receiving_member_id: number | undefined;
    receiving_member_name: string | undefined;
    created_at: string;
    member_name: string;
}
