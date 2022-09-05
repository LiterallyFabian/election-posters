create table votes
(
    user_id   varchar(36)                                      not null comment 'used to prevent users voting on the same poster twice',
    party_id  enum ('S', 'M', 'SD', 'C', 'V', 'KD', 'L', 'MP') not null comment 'all the parties',
    poster_id tinyint                                          null comment '0-indexed',
    date      datetime                                         null,
    vote      enum ('yes', 'no', 'skip')                       null comment 'what the user thought about this poster',
    constraint votes_uindex
        unique (user_id,
                party_id,
                poster_id)
)
    comment 'Containing individual poster votes.';


