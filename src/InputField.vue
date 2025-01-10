<template>
    <div class="input-group">
        <label :for="id">{{ label }}</label>
        <input :type="type" :id="id" :value="modelValue" :placeholder="placeholder"
            @input="$emit('update:modelValue', $event.target.value)" />
    </div>
</template>

<script>
export default {
    name: 'InputField',
    props: {
        label: { type: String, required: true },
        id: { type: String, required: true },
        type: { type: String, default: 'text' },
        modelValue: { type: String, required: true },
        placeholder: { type: String, default: '' },
    },
};
</script>

<style scoped>
.input-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #333;
}

input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
}
</style>
