import type { Provider } from '../../types';
import { CLAUDE_MODELS, OPENAI_MODELS, DEEPSEEK_MODELS } from '../../lib/constants';
import { Select, type SelectOption } from '../ui/select';

interface ModelSelectorProps {
  provider: Provider;
  selected: string | null;
  onSelect: (model: string | null) => void;
}

const modelMap: Record<Provider, SelectOption[]> = {
  claude: CLAUDE_MODELS,
  openai: OPENAI_MODELS,
  deepseek: DEEPSEEK_MODELS,
};

export function ModelSelector({
  provider,
  selected,
  onSelect,
}: ModelSelectorProps) {
  const models = modelMap[provider];

  const options: SelectOption[] = [
    { value: '__default__', label: 'Use default model' },
    ...models,
  ];

  return (
    <div>
      <Select
        label="Model"
        options={options}
        value={selected || '__default__'}
        onChange={(e) => {
          const val = e.target.value;
          onSelect(val === '__default__' ? null : val);
        }}
      />
      <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
        {selected
          ? 'Specific model selected'
          : 'Using provider default model'}
      </p>
    </div>
  );
}
