export const SHOPS = {
    'van_bao_cac': {
        name: 'Vạn Bảo Các - Chi Nhánh Nhân Giới',
        sections: {
            'dan_duoc': [
                { id: 'ngung_khi_dan', stock: 50 },
                { id: 'tich_coc_dan', stock: 2000 },
                { id: 'hoi_huyet_dan', stock: 100 },
                { id: 'ngo_dao_tra', stock: 20 },
                { id: 'bach_hoa_linh_tuu', stock: 30 },
                { id: 'ngo_dao_dan', stock: 5, minVip: 1 },
                { id: 'thanh_tam_dan', stock: 10 },
                { id: 'truc_co_dan', stock: 2, minVip: 1 },
                { id: 'hoa_nguyen_dan', stock: 1, minVip: 2 },
                { id: 'ngoc_de_dan', stock: 15 },
                { id: 'hoa_duong_dan', stock: 5, minVip: 1 },
                { id: 'hoi_linh_dan', stock: 30 },
                { id: 'tieu_dao_qua', stock: 8 }
            ],
            'luyen_dan': [
                { id: 'pham_lu', stock: 10 },
                { id: 'huyen_lu', stock: 1, minVip: 1 },
                { id: 'dia_lu', stock: 1, minVip: 3 },
                { id: 'thien_lu', stock: 1, minVip: 5 },
                { id: 'dan_phuong_hoi_linh_dan', stock: 5 },
                { id: 'dan_phuong_ngoc_de_dan', stock: 2 },
                { id: 'dan_phuong_than_tam_dan', stock: 2 },
                { id: 'dan_phuong_truc_co_dan', stock: 1, minVip: 2 },
                { id: 'dan_phuong_bo_nguyen_dan', stock: 3 }
            ],
            'phap_bao': [
                { id: 'linh_hoa', stock: 10 },
                { id: 'phi_kiem_go', stock: 5 },
                { id: 'ao_bo_so_cap', stock: 5 },
                { id: 'ngu_phong_phi_chu', stock: 2 },
                { id: 'truyen_tong_lenh', stock: 1 },
                { id: 'thanh_hong_kiem', stock: 1, minVip: 1 },
                { id: 'phi_kiem_thanh_tuyen', stock: 3 },
                { id: 'bat_quai_kinh', stock: 1, minVip: 1 },
                { id: 'hu_thien_dinh', stock: 1, minVip: 3 },
                { id: 'bat_linh_xich', stock: 1, minVip: 2 },
                { id: 'binh_son_an', stock: 1, minVip: 2 },
                { id: 'phong_loi_si', stock: 1, minVip: 4 },
                { id: 'vo_dinh_tieu_dao_cam', stock: 1, minVip: 5 },
                { id: 'van_tinh_nho_quan', stock: 1, minVip: 5 },
                { id: 'that_thai_huyen_nghien', stock: 1, minVip: 5 },
                { id: 'te_hon_toa', stock: 1, minVip: 5 },
                { id: 'luyen_phong_thach', stock: 1, minVip: 5 },
                { id: 'kim_than_xa_loi', stock: 1, minVip: 5 },
                { id: 'duong_kiem_ho', stock: 1, minVip: 5 },
                { id: 'cuu_mach_linh_cham', stock: 1, minVip: 5 },
                { id: 'co_luyen_lung', stock: 1, minVip: 5 },
                { id: 'chan_vu_nho_quan_ta', stock: 1, minVip: 5 },
                { id: 'chan_vu_nho_quan_huu', stock: 1, minVip: 5 },
                { id: 'bo_thien_lang', stock: 1, minVip: 5 },
                { id: 'nguyen_tu_cuc_son', stock: 1, minVip: 4 },
                { id: 'bac_cuc_nguyen_quang_cuc_son', stock: 1, minVip: 4 },
                { id: 'hao_am_han_phach_cuc_son', stock: 1, minVip: 4 },
                { id: 'thai_at_thanh_quang_cuc_son', stock: 1, minVip: 4 },
                { id: 'am_duong_dai_ngu_hanh_cuc_son', stock: 1, minVip: 4 },
                { id: 'ban_thach_dinh_nguyen_kiem', stock: 1, minVip: 5 },
                { id: 'luc_duong_loi_hoa_kiem', stock: 1, minVip: 5 },
                { id: 'tu_tuong_bo_de_kiem', stock: 1, minVip: 5 },
                { id: 'quan_han_linh_ngoc_bat', stock: 1, minVip: 5 },
                { id: 'that_tinh_ban_nguyet_thinh', stock: 1, minVip: 5 },
                { id: 'to_nga_suong_nguyet_luan', stock: 1, minVip: 5 },
                { id: 'ban_long_bang_ngoc_nghien', stock: 1, minVip: 4 },
                { id: 'giac_tien_bich_ngoc_cam', stock: 1, minVip: 4 },
                { id: 'huyen_kim_long_tu_kiem', stock: 1, minVip: 5 },
                { id: 'kim_o_ly_hoa_phien', stock: 1, minVip: 3 },
                { id: 'ly_ho_hieu_tien_lenh', stock: 1, minVip: 4 },
                { id: 'moc_long_phap_bao', stock: 1, minVip: 3 },
                { id: 'ngoc_long_tuyen', stock: 1, minVip: 5 },
                { id: 'thien_dao_bi', stock: 1, minVip: 5 },
                { id: 'tinh_hoa_nguyet_dai', stock: 1, minVip: 3 },
                { id: 'van_thuy_luu_ly_binh', stock: 1, minVip: 4 }
            ],
            'nguyen_lieu': [
                { id: 'tich_coc_thao', stock: 5000 },
                { id: 'linh_coc', stock: 10000 },
                { id: 'linh_thao_thap', stock: 200 },
                { id: 'linh_thao_10y', stock: 50 },
                { id: 'linh_thao_100y', stock: 10, minVip: 1 },
                { id: 'yeu_huyet', stock: 50 },
                { id: 'yeu_dan_so', stock: 20 },
                { id: 'hoa_tinh_thach', stock: 15 },
                { id: 'thien_dao_than_thach', stock: 1, minVip: 5 },
                { id: 'thanh_lien_dia_tam_hoa_seed', stock: 1, minVip: 3 },
                { id: 'ngoc_de_hoa', stock: 100 },
                { id: 'thanh_long_sam', stock: 40 },
                { id: 'tuyet_oanh_thao', stock: 30 },
                { id: 'hoa_duong_chi', stock: 25 },
                { id: 'cuu_tich_chi', stock: 15 },
                { id: 'linh_thao_cao', stock: 10, minVip: 1 }
            ],
            'cong_phap': [
                { id: 'truong_xuan_nap_khi_quyet', stock: 10 },
                { id: 'liet_duong_cong', stock: 2 },
                { id: 'han_thuy_quyet', stock: 2 },
                { id: 'thanh_moc_tam_kinh', stock: 2 },
                { id: 'canh_kim_quyet', stock: 2 },
                { id: 'hau_tho_cong', stock: 2 },
                { id: 'man_nguu_kinh', stock: 3 },
                { id: 'duong_than_quyet', stock: 3 },
                { id: 'huyet_don_thuat', stock: 1, minVip: 1 },
                { id: 'cuu_chuyen_kim_than', stock: 1, minVip: 2 },
                { id: 'u_minh_huy_ngan', stock: 1, minVip: 2 },
                { id: 'phong_loi_quyet', stock: 1, minVip: 3 }
            ],
            'tran_phap': [
                { id: 'tran_do_tu_linh', stock: 5 }
            ],
            'phu_luc': [
                { id: 'hoang_chi_phu', stock: 100 },
                { id: 'chu_sa_muc', stock: 50 },
                { id: 'truc_phu_but', stock: 1 },
                { id: 'hoa_cau_phu', stock: 20 },
                { id: 'kim_cuong_phu', stock: 5, minVip: 1 },
                { id: 'pha_khong_phu', stock: 5 }
            ],
            'luyen_khi': [
                { id: 'de_khi_dai', stock: 5 },
                { id: 'huyen_thiet', stock: 50 },
                { id: 'tinh_kim', stock: 20 },
                { id: 'luyen_khi_dai', stock: 1, minVip: 1 }
            ],
            'bi_tich': [
                { id: 'di_hoa_bang', stock: 1 },
                { id: 'di_loi_bang', stock: 1 },
                { id: 'linh_the_luc', stock: 1 },
                { id: 'phap_bao_luc', stock: 1 },
                { id: 'ky_trung_bang', stock: 1 },
                { id: 'van_toc_thong_giam', stock: 1 },
                { id: 'dan_dao_chan_giai', stock: 1 },
                { id: 'luyen_khi_tong_cuong', stock: 1 },
                { id: 'thai_thuong_phu_kinh', stock: 1 },
                { id: 'tran_dao_thien_thu', stock: 1 },
                { id: 'co_quan_linh_ky', stock: 1 },
                { id: 'cuu_u_luyen_thi_thuat', stock: 1 },
                { id: 'ban_ve_bat_quai_kinh', stock: 1 },
                { id: 'ban_ve_phi_kiem_tinh_ha', stock: 1, minVip: 1 },
                { id: 'ban_ve_long_lan_giap', stock: 1, minVip: 2 },
                { id: 'huyen_thiet', stock: 20, minVip: 1 },
                { id: 'chu_sa_muc', stock: 10 },
                { id: 'phu_van_kim_cuong_phu', stock: 2 },
                { id: 'phu_van_than_hanh_phu', stock: 2 },
                { id: 'phu_van_thun_di_phu', stock: 1, minVip: 1 },
                { id: 'tran_do_tu_linh_tran', stock: 1 },
                { id: 'tran_do_ao_anh_tran', stock: 1 },
                { id: 'tran_do_sat_kiem_tran', stock: 1, minVip: 1 },
                { id: 'thiet_moc_bach_nien', stock: 5, minVip: 1 },
                { id: 'ban_ve_kiem_khoi', stock: 1, minVip: 1 },
                { id: 'bi_phuong_dong_giap_thi', stock: 1, minVip: 2 },
                { id: 'van_lac_tam_viem_seed', stock: 1, minVip: 4 },
                { id: 'truyen_dao_thanh_gian', stock: 1, minVip: 5 },
                { id: 'tinh_lien_yeu_hoa_seed', stock: 1, minVip: 5 }
            ],
            'linh_dien': [
                { id: 'linh_chung_thanh_phuc_thao', stock: 100 },
                { id: 'linh_chung_tu_lam_hoa', stock: 50 },
                { id: 'linh_chung_ngoc_de_hoa', stock: 80 },
                { id: 'linh_chung_thanh_long_sam', stock: 30 },
                { id: 'linh_chung_hoa_diem_thao', stock: 20 },
                { id: 'linh_chung_hoa_duong_chi', stock: 20 },
                { id: 'linh_chung_han_tuy_hoa', stock: 20 },
                { id: 'linh_chung_tuyet_oanh_thao', stock: 20 },
                { id: 'linh_chung_u_minh_hoa', stock: 5, minVip: 1 },
                { id: 'linh_chung_cuu_tich_chi', stock: 10 }
            ],
            'ky_trung': [
                { id: 'trung_phe_kim_trung', stock: 1, minVip: 2 },
                { id: 'trung_bang_tam', stock: 3, minVip: 1 },
                { id: 'trung_huyet_ngoc_tri_chu', stock: 5 },
                { id: 'trung_kim_giap_hac', stock: 2, minVip: 1 },
                { id: 'trung_huyen_diem_nga', stock: 5 },
                { id: 'trung_loi_bang', stock: 1, minVip: 3 },
                { id: 'trung_thien_phong_ngan_uynh', stock: 1, minVip: 5 }
            ],
            'linh_thu': [
                { id: 'linh_thu_dai_so', stock: 5 },
                { id: 'linh_thu_dai_trung', stock: 2, minVip: 1 },
                { id: 'linh_thu_dai_cao', stock: 1, minVip: 3 },
                { id: 'trung_giao_long', stock: 1, minVip: 4 },
                { id: 'trung_hac_xa', stock: 2, minVip: 2 },
                { id: 'trung_hoa_viem', stock: 3, minVip: 1 }
            ],
            'tui_tru_vat': [
                { id: 'linh_hu_tui', stock: 5 },
                { id: 'can_khon_tui', stock: 2, minVip: 1 },
                { id: 'thao_thiet_can_khon_dai', stock: 1, minVip: 3 }
            ]
        }
    },
    'linh_bao_lau': {
        name: 'Linh Bảo Lâu - Nhân Giới Chi Nhánh',
        sections: {
            'dan_duoc': [
                { id: 'ngung_khi_dan', stock: 100 },
                { id: 'hoi_huyet_dan', stock: 200 },
                { id: 'bach_hoa_linh_tuu', stock: 50 },
                { id: 'truc_co_dan', stock: 5 },
                { id: 'hoa_nguyen_dan', stock: 2, minVip: 1 }
            ],
            'luyen_dan': [
                { id: 'huyen_lu', stock: 5 }
            ],
            'phap_bao': [
                { id: 'phi_kiem_thanh_tuyen', stock: 10 },
                { id: 'bat_quai_kinh', stock: 5 },
                { id: 'tao_hoa_tien_dinh', stock: 1, minVip: 5 },
                { id: 'huyen_kim_long_tu_kiem', stock: 1, minVip: 5 },
                { id: 'thien_dao_bi', stock: 1, minVip: 5 },
                { id: 'van_thuy_luu_ly_binh', stock: 1, minVip: 4 },
                { id: 'ngu_phong_phi_chu', stock: 3 },
                { id: 'truyen_tong_lenh', stock: 2 }
            ],
            'nguyen_lieu': [
                { id: 'tich_coc_thao', stock: 5000 },
                { id: 'linh_coc', stock: 5000 },
                { id: 'linh_thao_100y', stock: 50 },
                { id: 'yeu_dan_so', stock: 100 },
                { id: 'hoa_tinh_thach', stock: 30 }
            ],
            'cong_phap': [
                { id: 'liet_duong_cong', stock: 5 },
                { id: 'han_thuy_quyet', stock: 5 },
                { id: 'u_minh_huy_ngan', stock: 2 }
            ],
            'tran_phap': [
                { id: 'tran_do_tu_linh', stock: 10 }
            ],
            'phu_luc': [
                { id: 'hoa_cau_phu', stock: 50 },
                { id: 'kim_cuong_phu', stock: 10 },
                { id: 'pha_khong_phu', stock: 10 }
            ],
            'luyen_khi': [
                { id: 'huyen_thiet', stock: 100 },
                { id: 'tinh_kim', stock: 50 }
            ],
            'ky_trung': [
                { id: 'ky_trung_bang', stock: 1 },
                { id: 'trung_phe_kim_trung', stock: 2, minVip: 1 },
                { id: 'trung_loi_bang', stock: 1, minVip: 2 }
            ],
            'linh_thu': [
                { id: 'linh_thu_dai_so', stock: 10 },
                { id: 'linh_thu_dai_trung', stock: 5 },
                { id: 'trung_giao_long', stock: 1, minVip: 3 },
                { id: 'trung_hac_xa', stock: 3, minVip: 1 },
                { id: 'trung_hoa_viem', stock: 5 }
            ],
            'tui_tru_vat': [
                { id: 'linh_hu_tui', stock: 10 },
                { id: 'can_khon_tui', stock: 5 },
                { id: 'thao_thiet_can_khon_dai', stock: 2, minVip: 1 }
            ]
        }
    }
};
