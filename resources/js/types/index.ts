export enum UserRole {
    Student = 1,
    Master = 2,
    SuperAdmin = 3,
    Admin = 4,
}

export enum PublicationStatus {
    Pending = 0,
    Approved = 1,
    Rejected = 2,
}

export enum ReportStatus {
    Pending = 0,
    ResolvedDismissed = 1,
    ResolvedHidden = 2,
}

export interface Career {
    id: number;
    name: string;
    code: string;
    is_active?: boolean;
}

export interface Subject {
    id: number;
    name: string;
    code?: string;
    career_id?: number;
    career?: Career;
}

export interface Professor {
    id: number;
    name: string;
    career_id?: number;
    career?: Career;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    role: UserRole;
    avatar?: string | null;
    career_id?: number | null;
    current_semester?: number | null;
    career?: Career | null;
    subjects?: Subject[];
    professors?: Professor[];
    publications_count?: number;
}

export interface Publication {
    id: number;
    user_id: number;
    subject_id: number;
    professor_id: number | null;
    career_id?: number;
    semester: number;
    title: string;
    description?: string | null;
    file_url?: string | null;
    storage_key?: string | null;
    storage_disk?: string | null;
    file_original_name?: string | null;
    file_type?: string | null;
    file_size?: number | null;
    status: PublicationStatus;
    is_visible?: boolean;
    reviewed_by?: number | null;
    reviewed_at?: string | null;
    rejection_reason?: string | null;
    created_at: string;
    updated_at?: string;
    user?: User;
    subject?: Subject;
    professor?: Professor;
    career?: Career;
    likes_count?: number;
    comments_count?: number;
    is_liked?: boolean;
    is_favorited?: boolean;
    can_report?: boolean;
}

export interface PublicationAbilities {
    approve: boolean;
    reject: boolean;
    toggleVisibility: boolean;
    report: boolean;
}

export interface Comment {
    id: number;
    user_id: number;
    publication_id: number;
    parent_id?: number | null;
    body: string;
    is_visible?: boolean;
    created_at: string;
    user?: User;
    replies?: Comment[];
}

export interface PublicationReport {
    id: number;
    publication_id: number;
    reporter_id: number;
    reason: string;
    status: ReportStatus;
    reviewed_by?: number | null;
    reviewed_at?: string | null;
    admin_notes?: string | null;
    created_at: string;
    publication?: Publication;
    reporter?: User;
}

export interface AuditLog {
    id: number;
    actor_id: number;
    action: string;
    auditable_type: string;
    auditable_id: number;
    properties?: Record<string, unknown> | null;
    ip_address?: string | null;
    user_agent?: string | null;
    created_at: string;
    actor?: User;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number | null;
    to?: number | null;
    links?: PaginationLink[];
}

export interface SearchFilters {
    q?: string;
    career_id?: string | number;
    subject_id?: string | number;
    semester?: string | number;
    professor_id?: string | number;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash: FlashMessages;
};
