export default function showToast(title, message, color){
    return { title, message, color }
}

/* 

How to Use
1. Import toast.js and Toast.svelte to a Component
2. Setup some stuff like bellow
let toastData = null
let toastVisible = false

let handleClick = () => {
    toastData = showToast('Pembaruan Aplikasi', 'Aplikasi baru saja diperbarui', 'toast-success')
    toastVisible = true
};

3. Call the Toast component
{#if toastVisible}
	<Toast bind:toastVisible title={toastData.title} message={toastData.message} color={toastData.color} />
{/if}

*/