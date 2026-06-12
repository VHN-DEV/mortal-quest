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
                { id: 'tieu_dao_qua', stock: 8 },
                { id: 'thai_at_hoa_than_dan', stock: 1, minVip: 3 },
                { id: 'ho_menh_chan_nguyen_dan', stock: 5, minVip: 2 },
                { id: 'tu_cuc_ngo_dao_dan', stock: 2, minVip: 3 },
                { id: 'co_quan_phuc_nguyen_dan', stock: 10, minVip: 1 }
            ],
            'luyen_dan': [
                { id: 'pham_lu', stock: 10 },
                { id: 'huyen_thiet_trong_lu', stock: 1, minVip: 1 },
                { id: 'dia_long_phan_thien_lu', stock: 1, minVip: 3 },
                { id: 'thien_cuc_thai_hu_lu', stock: 1, minVip: 5 },
                { id: 'dan_phuong_hoi_linh_dan', stock: 5 },
                { id: 'dan_phuong_ngoc_de_dan', stock: 2 },
                { id: 'dan_phuong_thanh_tam_dan', stock: 2 },
                { id: 'dan_phuong_truc_co_dan', stock: 1, minVip: 2 },
                { id: 'dan_phuong_bo_nguyen_dan', stock: 3 },
                { id: 'phan_thien_dinh', stock: 1, minVip: 4 }
            ],
            'phap_bao': [
                { id: 'linh_hoa', stock: 10 },
                { id: 'phi_kiem_go', stock: 5 },
                { id: 'tho_bo_pham_y', stock: 5 },
                { id: 'ngu_phong_phi_chu', stock: 2 },
                { id: 'thuong_co_truyen_tong_lenh', stock: 1 },
                { id: 'thanh_hong_kiem', stock: 1, minVip: 1 },
                { id: 'thanh_tuyen_kiem', stock: 3 },
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
                { id: 'quang_han_linh_ngoc_bat', stock: 1, minVip: 5 },
                { id: 'that_tinh_ban_nguyet_thinh', stock: 1, minVip: 5 },
                { id: 'to_nga_suong_nguyet_luan', stock: 1, minVip: 5 },
                { id: 'ban_long_bang_ngoc_nghien', stock: 1, minVip: 4 },
                { id: 'giac_tien_bich_ngoc_cam', stock: 1, minVip: 4 },
                { id: 'huyen_kim_long_tu_kiem', stock: 1, minVip: 5 },
                { id: 'kim_o_ly_hoa_phien', stock: 1, minVip: 3 },
                { id: 'ly_ho_hieu_tien_lenh', stock: 1, minVip: 4 },
                { id: 'moc_long', stock: 1, minVip: 3 },
                { id: 'ngoc_long_tuyen', stock: 1, minVip: 5 },
                { id: 'thien_dao_bi', stock: 1, minVip: 5 },
                { id: 'tinh_hoa_nguyet_dai', stock: 1, minVip: 3 },
                { id: 'van_thuy_luu_ly_binh', stock: 1, minVip: 4 },
                { id: 'loi_dinh_than_binh', stock: 1, minVip: 2 },
                { id: 'ngu_hanh_ho_the_giap', stock: 1, minVip: 3 },
                { id: 'hu_vo_than_kinh', stock: 1, minVip: 3 },
                { id: 'hon_don_loi_thap', stock: 1, minVip: 4 }
            ],
            'nguyen_lieu': [
                { id: 'tich_coc_thao', stock: 5000 },
                { id: 'tran_chau_linh_coc', stock: 10000 },
                { id: 'thanh_phuc_thao', stock: 200 },
                { id: 'thap_nien_hoang_tinh_thao', stock: 50 },
                { id: 'bach_nien_uan_co_thao', stock: 10, minVip: 1 },
                { id: 'yeu_thu_tinh_huyet', stock: 50 },
                { id: 'ha_pham_yeu_dan', stock: 20 },
                { id: 'hoa_tinh_thach', stock: 15 },
                { id: 'thien_dao_than_thach', stock: 1, minVip: 5 },
                { id: 'thanh_lien_dia_tam_hoa', stock: 1, minVip: 3 },
                { id: 'ngoc_de_hoa', stock: 100 },
                { id: 'thanh_long_sam', stock: 40 },
                { id: 'tuyet_oanh_thao', stock: 30 },
                { id: 'hoa_duong_chi', stock: 25 },
                { id: 'cuu_tich_chi', stock: 15 },
                { id: 'tu_nguyet_thao', stock: 10, minVip: 1 },
                { id: 'ngan_tinh_thao', stock: 20 },
                { id: 'cuu_u_linh_tuyet_lien', stock: 5, minVip: 2 },
                // --- 22 OTHER EXOTIC FLAMES ---
                { id: 'da_xa_co_de', stock: 1, minVip: 5 },
                { id: 'hu_vo_thon_viem', stock: 1, minVip: 5 },
                { id: 'tinh_lien_yeu_hoa', stock: 1, minVip: 5 },
                { id: 'kim_de_phan_thien_viem', stock: 1, minVip: 4 },
                { id: 'sinh_linh_chi_diem', stock: 1, minVip: 4 },
                { id: 'bat_hoang_pha_diet_diem', stock: 1, minVip: 4 },
                { id: 'cuu_u_kim_to_hoa', stock: 1, minVip: 3 },
                { id: 'hong_lien_nghiep_hoa', stock: 1, minVip: 3 },
                { id: 'tam_thien_diem_thuong_hoa', stock: 1, minVip: 3 },
                { id: 'cuu_u_phong_viem', stock: 1, minVip: 3 },
                { id: 'cot_loi_linh_hoa', stock: 1, minVip: 3 },
                { id: 'cuu_long_loi_cuong_hoa', stock: 1, minVip: 3 },
                { id: 'quy_linh_dia_hoa', stock: 1, minVip: 2 },
                { id: 'van_lac_tam_viem', stock: 1, minVip: 2 },
                { id: 'hai_tam_diem', stock: 1, minVip: 2 },
                { id: 'hoa_van_thuy_viem', stock: 1, minVip: 2 },
                { id: 'phan_thien_liet_diem', stock: 1, minVip: 2 },
                { id: 'phong_loi_no_diem', stock: 1, minVip: 1 },
                { id: 'long_phuong_diem', stock: 1, minVip: 1 },
                { id: 'luc_dao_luan_hoi_diem', stock: 1, minVip: 1 },
                { id: 'van_thu_linh_hoa', stock: 1, minVip: 1 },
                { id: 'huyen_hoang_viem', stock: 1 },
                // --- 10 EXOTIC LIGHTNINGS ---
                { id: 'hon_don_tu_tieu', stock: 1, minVip: 5 },
                { id: 'cuu_tiao_diet_the', stock: 1, minVip: 5 },
                { id: 'thai_hu_hu_khong', stock: 1, minVip: 5 },
                { id: 'dai_nhat_kim_o', stock: 1, minVip: 4 },
                { id: 'huyen_am_cuu_u', stock: 1, minVip: 4 },
                { id: 'thanh_min_at_moc', stock: 1, minVip: 3 },
                { id: 'bac_minh_han_sat', stock: 1, minVip: 3 },
                { id: 'tu_cuc_ma_diet', stock: 1, minVip: 2 },
                { id: 'thien_cuong_chinh_phap', stock: 1, minVip: 2 },
                { id: 'xich_viem_bao_loi', stock: 1, minVip: 1 }
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
                { id: 'phong_loi_quyet', stock: 1, minVip: 3 },
                { id: 'phan_quyet_cong_phap', stock: 1, minVip: 4 },
                { id: 'cuu_thien_van_loi_quyet_cong_phap', stock: 1, minVip: 4 }
            ],
            'tran_phap': [
                { id: 'tran_do_tu_linh', stock: 5 },
                { id: 'thai_cuc_huyen_tran_do', stock: 2, minVip: 2 }
            ],
            'phu_luc': [
                { id: 'hoang_chi_phu', stock: 100 },
                { id: 'chu_sa_linh_muc', stock: 50 },
                { id: 'truc_phu_but', stock: 1 },
                { id: 'hoa_cau_phu', stock: 20 },
                { id: 'kim_cuong_phu', stock: 5, minVip: 1 },
                { id: 'pha_khong_phu', stock: 5 },
                { id: 'dai_dich_chuyen_phu', stock: 2, minVip: 2 },
                { id: 'cuu_loi_diet_the_phu', stock: 3, minVip: 2 }
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
                { id: 'chu_thien_linh_the_luc', stock: 1 },
                { id: 'van_bao_luc', stock: 1 },
                { id: 'ky_trung_bang', stock: 1 },
                { id: 'van_toc_thong_giam', stock: 1 },
                { id: 'dan_dao_chan_giai', stock: 1 },
                { id: 'luyen_khi_tong_cuong', stock: 1 },
                { id: 'thai_thuong_phu_kinh', stock: 1 },
                { id: 'tran_dao_thien_thu', stock: 1 },
                { id: 'co_quan_linh_ky', stock: 1 },
                { id: 'cuu_u_luyen_thi_thuat', stock: 1 },
                { id: 'ban_ve_bat_quai_kinh', stock: 1 },
                { id: 'ban_ve_tinh_ha_phi_kiem', stock: 1, minVip: 1 },
                { id: 'ban_ve_long_lan_giap', stock: 1, minVip: 2 },
                { id: 'huyen_thiet', stock: 20, minVip: 1 },
                { id: 'chu_sa_linh_muc', stock: 10 },
                { id: 'phu_van_kim_cuong_phu', stock: 2 },
                { id: 'phu_van_than_hanh_phu', stock: 2 },
                { id: 'phu_van_thuan_di_phu', stock: 1, minVip: 1 },
                { id: 'tran_do_tu_linh_tran', stock: 1 },
                { id: 'tran_do_ao_anh_tran', stock: 1 },
                { id: 'tran_do_sat_kiem_tran', stock: 1, minVip: 1 },
                { id: 'bach_nien_thiet_moc', stock: 5, minVip: 1 },
                { id: 'ban_ve_kiem_khoi', stock: 1, minVip: 1 },
                { id: 'bi_phuong_luyen_che_dong_giap_thi', stock: 1, minVip: 2 },
                { id: 'van_lac_tam_viem_chung', stock: 1, minVip: 4 },
                { id: 'truyen_dao_thanh_gian', stock: 1, minVip: 5 },
                { id: 'tinh_lien_yeu_hoa_chung', stock: 1, minVip: 5 },
                { id: 'ban_ve_thanh_truc_phong_van_kiem', stock: 1, minVip: 3 }
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
                { id: 'linh_chung_cuu_tich_chi', stock: 10 },
                { id: 'linh_chung_ngan_tinh_thao', stock: 10 },
                { id: 'linh_chung_cuu_u_linh_tuyet_lien', stock: 5, minVip: 1 },
                { id: 'linh_chung_kim_loi_truc', stock: 1, minVip: 2 }
            ],
            'ky_trung': [
                { id: 'phe_kim_trung_linh_noan', stock: 1, minVip: 2 },
                { id: 'bang_tam_linh_noan', stock: 3, minVip: 1 },
                { id: 'huyet_ngoc_tri_chu_linh_noan', stock: 5 },
                { id: 'kim_giap_hac_linh_noan', stock: 2, minVip: 1 },
                { id: 'huyen_diem_nga_linh_noan', stock: 5 },
                { id: 'loi_bang_linh_noan', stock: 1, minVip: 3 },
                { id: 'thien_phong_ngan_uynh_linh_noan', stock: 1, minVip: 5 }
            ],
            'linh_thu': [
                { id: 'linh_thu_dai_so', stock: 5 },
                { id: 'linh_thu_dai_trung', stock: 2, minVip: 1 },
                { id: 'linh_thu_dai_cao', stock: 1, minVip: 3 },
                { id: 'giao_long_linh_noan', stock: 1, minVip: 4 },
                { id: 'hac_xa_yeu_noan', stock: 2, minVip: 2 },
                { id: 'hoa_viem_linh_noan', stock: 3, minVip: 1 }
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
                { id: 'huyen_thiet_trong_lu', stock: 5 }
            ],
            'phap_bao': [
                { id: 'thanh_tuyen_kiem', stock: 10 },
                { id: 'bat_quai_kinh', stock: 5 },
                { id: 'tao_hoa_tien_dinh', stock: 1, minVip: 5 },
                { id: 'huyen_kim_long_tu_kiem', stock: 1, minVip: 5 },
                { id: 'thien_dao_bi', stock: 1, minVip: 5 },
                { id: 'van_thuy_luu_ly_binh', stock: 1, minVip: 4 },
                { id: 'ngu_phong_phi_chu', stock: 3 },
                { id: 'thuong_co_truyen_tong_lenh', stock: 2 }
            ],
            'nguyen_lieu': [
                { id: 'tich_coc_thao', stock: 5000 },
                { id: 'tran_chau_linh_coc', stock: 5000 },
                { id: 'bach_nien_uan_co_thao', stock: 50 },
                { id: 'ha_pham_yeu_dan', stock: 100 },
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
                { id: 'pha_khong_phu', stock: 10 },
                { id: 'dai_dich_chuyen_phu', stock: 2, minVip: 1 }
            ],
            'luyen_khi': [
                { id: 'huyen_thiet', stock: 100 },
                { id: 'tinh_kim', stock: 50 }
            ],
            'ky_trung': [
                { id: 'ky_trung_bang', stock: 1 },
                { id: 'phe_kim_trung_linh_noan', stock: 2, minVip: 1 },
                { id: 'loi_bang_linh_noan', stock: 1, minVip: 2 }
            ],
            'linh_thu': [
                { id: 'linh_thu_dai_so', stock: 10 },
                { id: 'linh_thu_dai_trung', stock: 5 },
                { id: 'giao_long_linh_noan', stock: 1, minVip: 3 },
                { id: 'hac_xa_yeu_noan', stock: 3, minVip: 1 },
                { id: 'hoa_viem_linh_noan', stock: 5 }
            ],
            'tui_tru_vat': [
                { id: 'linh_hu_tui', stock: 10 },
                { id: 'can_khon_tui', stock: 5 },
                { id: 'thao_thiet_can_khon_dai', stock: 2, minVip: 1 }
            ]
        }
    },
    'van_bao_cac_linh_gioi': {
        name: 'Vạn Bảo Các - Chi Nhánh Linh Giới',
        sections: {
            'dan_duoc': [
                { id: 'hoi_linh_dan', stock: 200 },
                { id: 'tieu_dao_qua', stock: 50 },
                { id: 'hoa_nguyen_dan', stock: 20, minVip: 1 },
                { id: 'ho_menh_chan_nguyen_dan', stock: 30, minVip: 1 },
                { id: 'tu_cuc_ngo_dao_dan', stock: 10, minVip: 2 },
                { id: 'thai_at_hoa_than_dan', stock: 5, minVip: 3 },
                { id: 'co_quan_phuc_nguyen_dan', stock: 50, minVip: 1 },
                { id: 'tich_coc_dan', stock: 5000 },
                { id: 'ngo_dao_dan', stock: 30, minVip: 1 },
                { id: 'thanh_tam_dan', stock: 50 },
                { id: 'truc_co_dan', stock: 10, minVip: 1 },
                { id: 'tien_ngoc', stock: 20, minVip: 2 },
                { id: 'sinh_menh_thach', stock: 15, minVip: 1 }
            ],
            'luyen_dan': [
                { id: 'dia_long_phan_thien_lu', stock: 5, minVip: 1 },
                { id: 'thien_cuc_thai_hu_lu', stock: 3, minVip: 3 },
                { id: 'dan_phuong_hoi_linh_dan', stock: 20 },
                { id: 'dan_phuong_ngoc_de_dan', stock: 10 },
                { id: 'dan_phuong_thanh_tam_dan', stock: 10 },
                { id: 'dan_phuong_truc_co_dan', stock: 5, minVip: 1 },
                { id: 'dan_phuong_bo_nguyen_dan', stock: 15 },
                { id: 'phan_thien_dinh', stock: 3, minVip: 3 }
            ],
            'phap_bao': [
                { id: 'hu_thien_dinh', stock: 1, minVip: 2 },
                { id: 'phong_loi_si', stock: 2, minVip: 2 },
                { id: 'vo_dinh_tieu_dao_cam', stock: 1, minVip: 3 },
                { id: 'nguyen_tu_cuc_son', stock: 2, minVip: 2 },
                { id: 'bac_cuc_nguyen_quang_cuc_son', stock: 2, minVip: 2 },
                { id: 'hao_am_han_phach_cuc_son', stock: 2, minVip: 2 },
                { id: 'thai_at_thanh_quang_cuc_son', stock: 2, minVip: 2 },
                { id: 'am_duong_dai_ngu_hanh_cuc_son', stock: 2, minVip: 2 },
                { id: 'ban_thach_dinh_nguyen_kiem', stock: 2, minVip: 3 },
                { id: 'luc_duong_loi_hoa_kiem', stock: 2, minVip: 3 },
                { id: 'tu_tuong_bo_de_kiem', stock: 2, minVip: 3 },
                { id: 'tao_hoa_tien_dinh', stock: 1, minVip: 4 },
                { id: 'quang_han_linh_ngoc_bat', stock: 2, minVip: 3 },
                { id: 'that_tinh_ban_nguyet_thinh', stock: 2, minVip: 3 },
                { id: 'to_nga_suong_nguyet_luan', stock: 2, minVip: 3 },
                { id: 'thien_dao_bi', stock: 2, minVip: 3 },
                { id: 'van_tinh_nho_quan', stock: 1, minVip: 4 },
                { id: 'that_thai_huyen_nghien', stock: 1, minVip: 4 },
                { id: 'te_hon_toa', stock: 1, minVip: 4 },
                { id: 'huyen_kim_long_tu_kiem', stock: 2, minVip: 3 },
                { id: 'ngoc_long_tuyen', stock: 1, minVip: 4 },
                { id: 'truyen_dao_thanh_gian', stock: 1, minVip: 4 },
                { id: 'thien_dao_than_thach', stock: 1, minVip: 5 },
                { id: 'chuong_thien_binh', stock: 1, minVip: 5 }
            ],
            'nguyen_lieu': [
                { id: 'tran_chau_linh_coc', stock: 50000 },
                { id: 'thanh_lien_dia_tam_hoa', stock: 5, minVip: 1 },
                { id: 'cuu_u_linh_tuyet_lien', stock: 20, minVip: 1 },
                { id: 'da_xa_co_de', stock: 3, minVip: 3 },
                { id: 'hu_vo_thon_viem', stock: 3, minVip: 3 },
                { id: 'tinh_lien_yeu_hoa', stock: 3, minVip: 3 },
                { id: 'kim_de_phan_thien_viem', stock: 5, minVip: 2 },
                { id: 'sinh_linh_chi_diem', stock: 5, minVip: 2 },
                { id: 'bat_hoang_pha_diet_diem', stock: 5, minVip: 2 },
                { id: 'hon_don_tu_tieu', stock: 2, minVip: 4 },
                { id: 'cuu_tiao_diet_the', stock: 2, minVip: 4 },
                { id: 'thai_hu_hu_khong', stock: 2, minVip: 4 },
                { id: 'dai_nhat_kim_o', stock: 3, minVip: 3 },
                { id: 'huyen_am_cuu_u', stock: 3, minVip: 3 },
                { id: 'thanh_min_at_moc', stock: 5, minVip: 2 },
                { id: 'bac_minh_han_sat', stock: 5, minVip: 2 },
                { id: 'thuong_pham_linh_thach', stock: 500 },
                { id: 'cuc_pham_linh_thach', stock: 50, minVip: 2 },
                { id: 'hoa_tinh_thach', stock: 100 },
                { id: 'thien_dao_than_thach', stock: 2, minVip: 4 }
            ],
            'cong_phap': [
                { id: 'phong_loi_quyet', stock: 5, minVip: 1 },
                { id: 'phan_quyet_cong_phap', stock: 3, minVip: 2 },
                { id: 'cuu_thien_van_loi_quyet_cong_phap', stock: 3, minVip: 2 },
                { id: 'u_minh_huy_ngan', stock: 5, minVip: 1 },
                { id: 'cuu_chuyen_kim_than', stock: 5, minVip: 1 },
                { id: 'huyet_don_thuat', stock: 5, minVip: 1 }
            ],
            'tran_phap': [
                { id: 'thai_cuc_huyen_tran_do', stock: 5, minVip: 1 },
                { id: 'tran_do_tu_linh', stock: 20 }
            ],
            'phu_luc': [
                { id: 'cuu_loi_diet_the_phu', stock: 10 },
                { id: 'pha_khong_phu', stock: 30 },
                { id: 'kim_cuong_phu', stock: 20 },
                { id: 'phu_van_kim_cuong_phu', stock: 10 },
                { id: 'phu_van_than_hanh_phu', stock: 10 },
                { id: 'phu_van_thuan_di_phu', stock: 5, minVip: 2 },
                { id: 'dai_dich_chuyen_phu', stock: 5, minVip: 1 }
            ],
            'luyen_khi': [
                { id: 'tinh_kim', stock: 200 },
                { id: 'huyen_thiet', stock: 500 },
                { id: 'bach_nien_thiet_moc', stock: 20, minVip: 1 },
                { id: 'luyen_khi_dai', stock: 5, minVip: 2 }
            ],
            'bi_tich': [
                { id: 'di_hoa_bang', stock: 3 },
                { id: 'di_loi_bang', stock: 3 },
                { id: 'van_bao_luc', stock: 2 },
                { id: 'tran_dao_thien_thu', stock: 2 },
                { id: 'tinh_lien_yeu_hoa_chung', stock: 1, minVip: 3 },
                { id: 'van_lac_tam_viem_chung', stock: 1, minVip: 2 },
                { id: 'truyen_dao_thanh_gian', stock: 1, minVip: 4 },
                { id: 'ban_ve_long_lan_giap', stock: 3, minVip: 1 },
                { id: 'ban_ve_tinh_ha_phi_kiem', stock: 3, minVip: 1 },
                { id: 'ban_ve_thanh_truc_phong_van_kiem', stock: 5, minVip: 1 }
            ],
            'linh_dien': [
                { id: 'linh_chung_u_minh_hoa', stock: 20 },
                { id: 'linh_chung_cuu_tich_chi', stock: 30 },
                { id: 'linh_chung_ngan_tinh_thao', stock: 30 },
                { id: 'linh_chung_cuu_u_linh_tuyet_lien', stock: 15, minVip: 1 },
                { id: 'linh_chung_kim_loi_truc', stock: 5, minVip: 1 }
            ],
            'ky_trung': [
                { id: 'thien_phong_ngan_uynh_linh_noan', stock: 3, minVip: 2 },
                { id: 'loi_bang_linh_noan', stock: 5, minVip: 1 },
                { id: 'phe_kim_trung_linh_noan', stock: 5, minVip: 1 }
            ],
            'linh_thu': [
                { id: 'linh_thu_dai_cao', stock: 5, minVip: 1 },
                { id: 'giao_long_linh_noan', stock: 3, minVip: 2 },
                { id: 'hac_xa_yeu_noan', stock: 5 },
                { id: 'hoa_viem_linh_noan', stock: 5 }
            ],
            'tui_tru_vat': [
                { id: 'can_khon_tui', stock: 10 },
                { id: 'thao_thiet_can_khon_dai', stock: 5, minVip: 1 }
            ]
        }
    },
    'van_bao_cac_tien_gioi': {
        name: 'Vạn Bảo Các - Chi Nhánh Tiên Giới',
        sections: {
            'dan_duoc': [
                { id: 'thai_at_hoa_than_dan', stock: 50 },
                { id: 'tu_cuc_ngo_dao_dan', stock: 50 },
                { id: 'co_quan_phuc_nguyen_dan', stock: 200 },
                { id: 'ho_menh_chan_nguyen_dan', stock: 100 },
                { id: 'hoa_nguyen_dan', stock: 100 },
                { id: 'tieu_dao_qua', stock: 200 },
                { id: 'hoi_linh_dan', stock: 500 },
                { id: 'tich_coc_dan', stock: 99999 },
                { id: 'ngo_dao_dan', stock: 100 },
                { id: 'tien_ngoc', stock: 100 },
                { id: 'sinh_menh_thach', stock: 100 },
                { id: 'hon_don_tinh_thach', stock: 5, minVip: 4 }
            ],
            'luyen_dan': [
                { id: 'thien_cuc_thai_hu_lu', stock: 10 },
                { id: 'dia_long_phan_thien_lu', stock: 20 },
                { id: 'phan_thien_dinh', stock: 10 },
                { id: 'dan_phuong_hoi_linh_dan', stock: 100 },
                { id: 'dan_phuong_truc_co_dan', stock: 20 },
                { id: 'dan_phuong_bo_nguyen_dan', stock: 50 }
            ],
            'phap_bao': [
                { id: 'chuong_thien_binh', stock: 3, minVip: 2 },
                { id: 'tao_hoa_tien_dinh', stock: 3, minVip: 2 },
                { id: 'thien_dao_than_thach', stock: 5, minVip: 2 },
                { id: 'truyen_dao_thanh_gian', stock: 5, minVip: 2 },
                { id: 'hu_thien_dinh', stock: 3, minVip: 1 },
                { id: 'ban_thach_dinh_nguyen_kiem', stock: 5, minVip: 1 },
                { id: 'luc_duong_loi_hoa_kiem', stock: 5, minVip: 1 },
                { id: 'tu_tuong_bo_de_kiem', stock: 5, minVip: 1 },
                { id: 'quang_han_linh_ngoc_bat', stock: 5, minVip: 1 },
                { id: 'that_tinh_ban_nguyet_thinh', stock: 5, minVip: 1 },
                { id: 'to_nga_suong_nguyet_luan', stock: 5, minVip: 1 },
                { id: 'nguyen_tu_cuc_son', stock: 5, minVip: 1 },
                { id: 'bac_cuc_nguyen_quang_cuc_son', stock: 5, minVip: 1 },
                { id: 'hao_am_han_phach_cuc_son', stock: 5, minVip: 1 },
                { id: 'thai_at_thanh_quang_cuc_son', stock: 5, minVip: 1 },
                { id: 'am_duong_dai_ngu_hanh_cuc_son', stock: 5, minVip: 1 },
                { id: 'vo_dinh_tieu_dao_cam', stock: 3, minVip: 2 },
                { id: 'van_tinh_nho_quan', stock: 3, minVip: 2 },
                { id: 'that_thai_huyen_nghien', stock: 3, minVip: 2 },
                { id: 'huyen_kim_long_tu_kiem', stock: 5, minVip: 1 },
                { id: 'ngoc_long_tuyen', stock: 3, minVip: 2 },
                { id: 'te_hon_toa', stock: 3, minVip: 2 },
                { id: 'bo_thien_lang', stock: 3, minVip: 3 },
                { id: 'thien_dao_bi', stock: 5, minVip: 1 }
            ],
            'nguyen_lieu': [
                { id: 'cuc_pham_linh_thach', stock: 500 },
                { id: 'tien_tinh', stock: 10, minVip: 3 },
                { id: 'hon_don_tinh', stock: 3, minVip: 5 },
                { id: 'thanh_lien_dia_tam_hoa', stock: 20 },
                { id: 'cuu_u_linh_tuyet_lien', stock: 100 },
                { id: 'da_xa_co_de', stock: 10, minVip: 2 },
                { id: 'hu_vo_thon_viem', stock: 10, minVip: 2 },
                { id: 'tinh_lien_yeu_hoa', stock: 10, minVip: 2 },
                { id: 'kim_de_phan_thien_viem', stock: 15, minVip: 1 },
                { id: 'sinh_linh_chi_diem', stock: 15, minVip: 1 },
                { id: 'bat_hoang_pha_diet_diem', stock: 15, minVip: 1 },
                { id: 'hon_don_tu_tieu', stock: 5, minVip: 3 },
                { id: 'cuu_tiao_diet_the', stock: 5, minVip: 3 },
                { id: 'thai_hu_hu_khong', stock: 5, minVip: 3 },
                { id: 'dai_nhat_kim_o', stock: 8, minVip: 2 },
                { id: 'huyen_am_cuu_u', stock: 8, minVip: 2 },
                { id: 'thien_dao_than_thach', stock: 5, minVip: 3 },
                { id: 'hoa_tinh_thach', stock: 500 }
            ],
            'cong_phap': [
                { id: 'cuu_thien_van_loi_quyet_cong_phap', stock: 10 },
                { id: 'phan_quyet_cong_phap', stock: 10 },
                { id: 'phong_loi_quyet', stock: 20 },
                { id: 'cuu_chuyen_kim_than', stock: 10 },
                { id: 'u_minh_huy_ngan', stock: 10 },
                { id: 'huyet_don_thuat', stock: 10 }
            ],
            'tran_phap': [
                { id: 'thai_cuc_huyen_tran_do', stock: 20 },
                { id: 'tran_do_tu_linh', stock: 50 }
            ],
            'phu_luc': [
                { id: 'cuu_loi_diet_the_phu', stock: 50 },
                { id: 'pha_khong_phu', stock: 100 },
                { id: 'phu_van_kim_cuong_phu', stock: 30 },
                { id: 'phu_van_than_hanh_phu', stock: 30 },
                { id: 'phu_van_thuan_di_phu', stock: 20 },
                { id: 'dai_dich_chuyen_phu', stock: 10 }
            ],
            'luyen_khi': [
                { id: 'tinh_kim', stock: 1000 },
                { id: 'huyen_thiet', stock: 2000 },
                { id: 'bach_nien_thiet_moc', stock: 100 },
                { id: 'luyen_khi_dai', stock: 20 }
            ],
            'bi_tich': [
                { id: 'di_hoa_bang', stock: 10 },
                { id: 'di_loi_bang', stock: 10 },
                { id: 'van_bao_luc', stock: 5 },
                { id: 'tran_dao_thien_thu', stock: 5 },
                { id: 'tinh_lien_yeu_hoa_chung', stock: 3, minVip: 2 },
                { id: 'van_lac_tam_viem_chung', stock: 3, minVip: 2 },
                { id: 'truyen_dao_thanh_gian', stock: 3, minVip: 2 },
                { id: 'ban_ve_long_lan_giap', stock: 10 },
                { id: 'ban_ve_tinh_ha_phi_kiem', stock: 10 },
                { id: 'ban_ve_thanh_truc_phong_van_kiem', stock: 10 }
            ],
            'linh_dien': [
                { id: 'linh_chung_u_minh_hoa', stock: 100 },
                { id: 'linh_chung_cuu_tich_chi', stock: 100 },
                { id: 'linh_chung_ngan_tinh_thao', stock: 100 },
                { id: 'linh_chung_cuu_u_linh_tuyet_lien', stock: 50 },
                { id: 'linh_chung_kim_loi_truc', stock: 20 }
            ],
            'ky_trung': [
                { id: 'thien_phong_ngan_uynh_linh_noan', stock: 10 },
                { id: 'loi_bang_linh_noan', stock: 20 },
                { id: 'phe_kim_trung_linh_noan', stock: 20 },
                { id: 'bang_tam_linh_noan', stock: 15 }
            ],
            'linh_thu': [
                { id: 'linh_thu_dai_cao', stock: 20 },
                { id: 'giao_long_linh_noan', stock: 10 },
                { id: 'hac_xa_yeu_noan', stock: 15 },
                { id: 'hoa_viem_linh_noan', stock: 15 }
            ]
        }
    },
    'thai_nam_tieu_hoi': {
        name: 'Thái Nam Tiểu Hội - Tán Tu Họp Chợ',
        sections: {
            'dan_duoc': [
                { id: 'ngung_khi_dan', stock: 30 },
                { id: 'tich_coc_dan', stock: 500 },
                { id: 'hoi_huyet_dan', stock: 50 }
            ],
            'phap_bao': [
                { id: 'phi_kiem_go', stock: 10 },
                { id: 'tho_bo_pham_y', stock: 5 }
            ],
            'phu_luc': [
                { id: 'hoang_chi_phu', stock: 100 },
                { id: 'chu_sa_linh_muc', stock: 50 },
                { id: 'than_hanh_phu', stock: 20 }
            ],
            'nguyen_lieu': [
                { id: 'tich_coc_thao', stock: 100 },
                { id: 'tran_chau_linh_coc', stock: 200 }
            ]
        }
    },
    'te_van_cac': {
        name: 'Tề Vân Các - Trận Pháp Các',
        sections: {
            'tran_phap': [
                { id: 'tran_do_tu_linh', stock: 10 },
                { id: 'thai_cuc_huyen_tran_do', stock: 3, minVip: 1 },
                { id: 'dien_dao_ngu_hanh_tran_ky', stock: 1, minVip: 2 }
            ],
            'phu_luc': [
                { id: 'kim_cuong_phu', stock: 10 },
                { id: 'pha_khong_phu', stock: 10 },
                { id: 'dai_dich_chuyen_phu', stock: 2 },
                { id: 'truc_phu_but', stock: 2 }
            ],
            'cong_phap': [
                { id: 'han_thuy_quyet', stock: 2 },
                { id: 'hau_tho_cong', stock: 2 },
                { id: 'canh_kim_quyet', stock: 2 },
                { id: 'thanh_moc_tam_kinh', stock: 2 }
            ]
        }
    },
    'luc_lien_dien': {
        name: 'Lục Liên Điện - Yêu Thú Thương Hội',
        sections: {
            'nguyen_lieu': [
                { id: 'yeu_thu_tinh_huyet', stock: 50 },
                { id: 'ha_pham_yeu_dan', stock: 50 },
                { id: 'hoa_tinh_thach', stock: 20 },
                { id: 'giao_long_lan', stock: 10 }
            ],
            'ky_trung': [
                { id: 'phe_kim_trung_linh_noan', stock: 2, minVip: 1 },
                { id: 'bang_tam_linh_noan', stock: 5 },
                { id: 'kim_phe_trung_tinh_noan', stock: 2, minVip: 2 }
            ],
            'linh_thu': [
                { id: 'hac_xa_yeu_noan', stock: 3, minVip: 1 },
                { id: 'hoa_viem_linh_noan', stock: 5 }
            ],
            'phap_bao': [
                { id: 'kim_dien_hoan', stock: 1, minVip: 2 }
            ]
        }
    },
    'hach_lien_thuong_minh': {
        name: 'Hách Liên Thương Minh - Siêu Cấp Thương Hội',
        sections: {
            'dan_duoc': [
                { id: 'tu_cuc_ngo_dao_dan', stock: 5, minVip: 2 },
                { id: 'thai_at_hoa_than_dan', stock: 3, minVip: 3 },
                { id: 'ho_menh_chan_nguyen_dan', stock: 10, minVip: 1 }
            ],
            'phap_bao': [
                { id: 'chuong_thien_binh', stock: 1, minVip: 4 },
                { id: 'tao_hoa_tien_dinh', stock: 1, minVip: 3 },
                { id: 'bat_linh_xich', stock: 1, minVip: 1 }
            ],
            'nguyen_lieu': [
                { id: 'thien_dao_than_thach', stock: 2, minVip: 3 },
                { id: 'cuc_pham_linh_thach', stock: 20 },
                { id: 'huyen_thien_tram_linh_kiem_manh_vo', stock: 1, minVip: 3 },
                { id: 'thien_nien_cuu_khuc_linh_sam', stock: 2, minVip: 2 }
            ],
            'bi_tich': [
                { id: 'tinh_lien_yeu_hoa_chung', stock: 1, minVip: 2 },
                { id: 'van_lac_tam_viem_chung', stock: 1, minVip: 2 }
            ]
        }
    }
};

