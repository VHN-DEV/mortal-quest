export const SHOPS = {
    'nhan_gioi': {
        name: 'Vạn Bảo Các - Chi Nhánh Nhân Giới',
        sections: {
            'dan_duoc': [
                { id: 'ngung_khi_dan', stock: 50 },
                { id: 'hoi_huyet_dan', stock: 100 },
                { id: 'thanh_tam_dan', stock: 10 },
                { id: 'truc_co_dan', stock: 2, minVip: 1 }
            ],
            'phap_bao': [
                { id: 'phi_kiem_go', stock: 5 },
                { id: 'ao_bo_so_cap', stock: 5 },
                { id: 'thanh_hong_kiem', stock: 1, minVip: 1 },
                { id: 'phi_kiem_thanh_tuyen', stock: 3 },
                { id: 'bat_quai_kinh', stock: 1, minVip: 1 },
                { id: 'huyen_lu_item', stock: 1, minVip: 2 }
            ],
            'nguyen_lieu': [
                { id: 'linh_thao_thap', stock: 200 },
                { id: 'linh_thao_10y', stock: 50 },
                { id: 'linh_thao_100y', stock: 10, minVip: 1 },
                { id: 'yeu_huyet', stock: 50 },
                { id: 'yeu_dan_so', stock: 20 },
                { id: 'hoa_tinh_thach', stock: 15 },
                { id: 'thanh_lien_hoa_seed', stock: 1, minVip: 3 }
            ],
            'cong_phap': [
                { id: 'truong_sinh_quyet', stock: 1 }
            ],
            'tran_phap': [
                { id: 'tran_do_tu_linh', stock: 5 }
            ],
            'phu_luc': [
                { id: 'hoang_chi_phu', stock: 100 },
                { id: 'chu_sa_muc', stock: 50 },
                { id: 'truc_phu_but', stock: 1 },
                { id: 'hoa_cau_phu', stock: 20 },
                { id: 'kim_cuong_phu', stock: 5, minVip: 1 }
            ],
            'luyen_khi': [
                { id: 'huyen_thiet', stock: 50 },
                { id: 'tinh_kim', stock: 20 },
                { id: 'luyen_khi_dai', stock: 1, minVip: 1 }
            ]
        }
    }
};
