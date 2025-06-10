import Swal from 'sweetalert2'

export const SwalDelete = () => {
  return Swal.fire({
    title: 'คุณแน่ใจหรือไม่?',
    text: 'หมวดหมู่นี้จะถูกลบและไม่สามารถกู้คืนได้!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'ใช่, ลบเลย!',
    cancelButtonText: 'ยกเลิก',
    reverseButtons: true
  })
}
