<script>
    export let rows = []
    export let usingNumber = true
</script>

<div class="table-responsive radius-sm">
    <table class="table {usingNumber ? 'number' : ''}">
        <thead>
            <tr>
                {#if usingNumber}    
                <th>No</th>
                {/if}
                <th>Nama</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody class="table-border-bottom">
            {#each rows as row, index}
            <tr>
                {#if usingNumber}
                <td>{index + 1}</td>
                {/if}
            </tr>
            {/each}
        </tbody>
    </table>
</div>

<svelte:head>
    <style>
        .table-responsive {
            border: 1px solid var(--neutral-border);
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        table {
            caption-side: bottom;
            border-collapse: collapse;
        }

        .table {
            width: 100%;
            vertical-align: middle;
            border-color: var(--neutral-border);
            margin-bottom: 0;
        }

        .table > thead {
            vertical-align: bottom;
        }

        .table th {
            padding: 1rem 1.25rem;
            text-transform: uppercase;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
            letter-spacing: 0px;
            text-align: start;
        }

        .table thead {
            border-bottom: 1px solid var(--neutral-border);
        }

        .table-border-bottom > tr {
            border-bottom: 1px solid var(--neutral-border);
        }

        .table-border-bottom > tr:last-child {
            border-bottom: transparent;
        }

        .table > tbody > tr > td {
            padding: 1rem 1.25rem;
            font-size: 14px;
            font-weight: 400;
            line-height: 18px;
            letter-spacing: 0px;
        }

        .table-stripped > tbody > tr:nth-child(odd){
            background-color: var(--neutral-surface);
        }

        .table-stripped > tbody > tr:nth-child(even){
            background-color: var(--neutral-white);
        }

        .table > tbody > tr:hover {
            cursor: pointer;
        }

        .number > thead > tr > th:first-child{
            width: 2rem;
            text-align: center;
        }

        .number > tbody > tr > td:first-child{
            width: 2rem;
            text-align: center;
        }
    </style>
</svelte:head>