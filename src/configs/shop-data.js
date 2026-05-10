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
                { id: 'phi_kiem_thanh_tuyen', stock: 3 }
            ],
            'nguyen_lieu': [
                { id: 'linh_thao_thap', stock: 200 },
                { id: 'linh_thao_trung', stock: 50 },
                { id: 'seed_linh_thao', stock: 50 },
                { id: 'ling_thach_ha', stock: 999 },
                { id: 'ling_thach_trung', stock: 100 }
            ],
            'cong_phap': [
                { id: 'truong_sinh_quyet', stock: 1 }
            ],
            'tran_phap': [
                { id: 'tran_do_tu_linh', stock: 5 }
            ]
        }
    }
};
