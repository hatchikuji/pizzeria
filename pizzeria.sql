create table pizza
(
    id_pizza  int auto_increment
        primary key,
    nb_pizza  int  not null,
    nom_pizza text not null
)
    engine = InnoDB;

create table produit
(
    id_produit  int auto_increment
        primary key,
    nb_produit  int  not null,
    nom_produit text not null
)
    engine = InnoDB;

create table lien
(
    id_pizza   int not null,
    id_produit int not null,
    quantite   int not null,
    constraint id_pizza
        unique (id_pizza, id_produit),
    constraint id_produit
        unique (id_produit),
    constraint lien_ibfk_1
        foreign key (id_produit) references produit (id_produit)
            on update cascade on delete cascade,
    constraint lien_ibfk_2
        foreign key (id_pizza) references pizza (id_pizza)
            on update cascade on delete cascade
)
    engine = InnoDB;


