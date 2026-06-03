<?php

namespace App\Enums;

enum TransactionAction: string
{
    case PublicationCreate = 'publication_create';
    case LikeCreate = 'like_create';
    case FavoriteCreate = 'favorite_create';
    case CommentCreate = 'comment_create';
    case ReportCreate = 'report_create';
}
