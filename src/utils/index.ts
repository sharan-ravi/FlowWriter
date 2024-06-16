import { ChatOptions } from "@mlc-ai/web-llm";

export const chatConfig = {
    "version": "0.1.0",
    "model_type": "qwen2",
    "quantization": "q4f16_1",
    "model_config": {
      "hidden_act": "silu",
      "hidden_size": 1536,
      "intermediate_size": 8960,
      "num_attention_heads": 12,
      "num_hidden_layers": 28,
      "num_key_value_heads": 2,
      "rms_norm_eps": 1e-06,
      "rope_theta": 1000000.0,
      "vocab_size": 151936,
      "tie_word_embeddings": true,
      "context_window_size": 32768,
      "prefill_chunk_size": 2048,
      "tensor_parallel_shards": 1,
      "head_dim": 128,
      "dtype": "float32",
      "max_batch_size": 80
    },
    "vocab_size": 151936,
    "context_window_size": 32768,
    "sliding_window_size": -1,
    "prefill_chunk_size": 2048,
    "attention_sink_size": -1,
    "tensor_parallel_shards": 1,
    "temperature": 0.7,
    "presence_penalty": 0.0,
    "frequency_penalty": 0.0,
    "repetition_penalty": 1.1,
    "top_p": 0.8,
    "tokenizer_files": [
      "tokenizer.json",
      "vocab.json",
      "merges.txt",
      "tokenizer_config.json"
    ],
    "tokenizer_info": {
      "token_postproc_method": "byte_level",
      "prepend_space_in_encode": false,
      "strip_space_in_decode": false
    },
    "conv_template": {
      "name": "chatml",
      "system_template": "<|im_start|>system\n{system_message}<|im_end|>\n",
      "system_message": "An AI assistant, that completes the given input.\n",
      "system_prefix_token_ids": null,
      "add_role_after_system_message": true,
      "roles": {
        "user": "<|im_start|>user",
        "assistant": "<|im_start|>assistant"
      },
      "role_templates": {
        "user": "{user_message}",
        "assistant": "{assistant_message}",
        "tool": "{tool_message}"
      },
      "messages": [],
      "seps": [
        "<|im_end|>\n"
      ],
      "role_content_sep": "\n",
      "role_empty_sep": "\n",
      "stop_str": [
        "<|im_end|>"
      ],
      "stop_token_ids": [
        2
      ],
      "function_string": "",
      "use_function_calling": false
    },
    "pad_token_id": 151643,
    "bos_token_id": 151643,
    "eos_token_id": [
      151645,
      151643
    ]
  } as unknown as ChatOptions;
  