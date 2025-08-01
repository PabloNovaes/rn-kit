# RN Shadcn UI - Simple Components

Componentes React Native simples no estilo Shadcn/ui. **Copie os componentes diretamente para seu projeto** e personalize como quiser!

## 🚀 Como usar

### 1. Copie os componentes que precisa

Simplesmente copie os arquivos da pasta `components/` para seu projeto:

\`\`\`
your-project/
├── components/
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
\`\`\`

### 2. Use nos seus componentes

\`\`\`tsx
import { Button } from './components/Button';
import { Card, CardHeader, CardTitle, CardContent } from './components/Card';
import { Input } from './components/Input';

function MyScreen() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exemplo</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Digite algo..." />
        <Button title="Clique aqui" />
      </CardContent>
    </Card>
  );
}
\`\`\`

## 📚 Componentes Disponíveis

### Button
\`\`\`tsx
<Button 
  title="Clique aqui"
  variant="default" // default | outline | ghost | destructive
  size="default" // sm | default | lg
  loading={false}
  onPress={() => console.log('Clicado!')}
/>
\`\`\`

### Card
\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Conteúdo */}
  </CardContent>
  <CardFooter>
    {/* Rodapé */}
  </CardFooter>
</Card>
\`\`\`

### Input
\`\`\`tsx
<Input
  label="Email"
  placeholder="Digite seu email"
  value={email}
  onChangeText={setEmail}
  error="Campo obrigatório"
/>
\`\`\`

## 🎨 Personalização

Como os componentes estão no seu projeto, você pode:

- ✅ Modificar cores diretamente no código
- ✅ Adicionar novos variants
- ✅ Mudar estilos como quiser
- ✅ Adicionar novas props
- ✅ Integrar com seu sistema de design

### Exemplo de personalização:

\`\`\`tsx
// Modifique diretamente no Button.tsx
const variantStyles: Record<string, ViewStyle> = {
  default: { backgroundColor: '#171717' },
  primary: { backgroundColor: '#3b82f6' }, // Nova variante
  outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e5e5e5' },
  // ...
};
\`\`\`

## 🛠️ Desenvolvimento

Para testar os componentes:

\`\`\`bash
npm install
npm start
\`\`\`

## 📄 Licença

MIT - Use como quiser!

## 💡 Filosofia

Inspirado no Shadcn/ui, estes componentes são:
- **Simples**: Sem dependências complexas
- **Personalizáveis**: Código aberto para modificação
- **Diretos**: Copie e cole no seu projeto
- **Limpos**: Sem abstrações desnecessárias
