---
Task ID: 1
Agent: Main Agent
Task: Clonar repositorio e adicionar Termos de Uso, Politica de Privacidade e Modal de Aceite

Work Log:
- Clonou repositorio MicaelSanPedro/mundo-aprender do GitHub
- Analisou estrutura do projeto Next.js 16 com Tailwind CSS e shadcn/ui
- Criou pagina de Termos de Uso em /src/app/termos-de-uso/page.tsx (8 secoes completas)
- Criou pagina de Politica de Privacidade em /src/app/politica-de-privacidade/page.tsx (10 secoes completas, LGPD compliant)
- Criou componente AcceptanceModal em /src/components/acceptance-modal.tsx com:
  - Verificacao de versao via localStorage
  - Dois checkboxes obrigatorios (Termos + Privacidade)
  - Links para as paginas em novas abas
  - Nao permite fechar sem aceitar
  - Animacao com framer-motion
  - Design consistente com o tema kid-friendly do projeto
- Atualizou layout.tsx para incluir o AcceptanceModal globalmente
- Adicionou links de Termos de Uso e Politica de Privacidade no footer da pagina principal
- Build concluido com sucesso (14 rotas geradas, 0 erros)

Stage Summary:
- Produzidos: termos-de-uso/page.tsx, politica-de-privacidade/page.tsx, acceptance-modal.tsx
- Layout atualizado com modal global
- Footer atualizado com links legais
- Build validado com sucesso
