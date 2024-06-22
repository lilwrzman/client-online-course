<script>
    export let percentage = 0
</script>

<div id="progress-bar">
    <div class="progress-background">
        <div class="progress" style="width: {percentage}%;"></div>
    </div>
    <p class="percentage">{percentage}%</p>
</div>

<style>
    #progress-bar {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .progress-background {
        flex-grow: 1;
        background-color: var(--neutral-surface);
        border-radius: .25rem;
    }

    .progress {
        background-color: var(--primary-main);
        height: 10px;
        border-radius: .25rem;
    }

    .percentage {
        width: 15%;
        margin-bottom: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
    }
</style>