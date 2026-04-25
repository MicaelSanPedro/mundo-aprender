import { Shield, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade - Mundo Aprender",
  description: "Política de privacidade da plataforma Mundo Aprender - Materiais Didáticos Divertidos",
};

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Política de Privacidade
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Última atualização: 23 de abril de 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-kid-orange hover:text-kid-orange/70 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a loja
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-kid-blue/10 shadow-lg p-6 sm:p-10 space-y-8">
          {/* Introdução */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <Lock className="h-5 w-5 text-kid-blue" />
              </span>
              <h2 className="text-xl font-bold text-foreground">1. Introdução</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O <strong>Mundo Aprender</strong> valoriza a privacidade e a segurança dos seus usuários.
              Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e
              protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de
              Dados (LGPD - Lei 13.709/2018). Ao utilizar nossa plataforma, você consente com as
              práticas descritas neste documento. Recomendamos a leitura atenta de todas as seções
              para que você compreenda plenamente como tratamos seus dados pessoais.
            </p>
          </section>

          {/* Dados coletados */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-orange/10">
                <span className="text-lg font-bold text-kid-orange">2</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">2. Dados Coletados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Podemos coletar os seguintes tipos de informações para garantir o funcionamento
              adequado dos nossos serviços e oferecer uma experiência personalizada:
            </p>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de cadastro:</strong> Nome completo, endereço de e-mail e número
                  de telefone fornecidos no momento da compra ou ativação de código.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de transação:</strong> Histórico de compras, métodos de pagamento
                  utilizados e informações relacionadas ao processamento de pedidos.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de navegação:</strong> Endereço IP, tipo de navegador, sistema
                  operacional, páginas visitadas e tempo de permanência na plataforma, coletados
                  automaticamente por cookies e tecnologias similares.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de uso:</strong> Produtos visualizados, códigos de ativação
                  utilizados e interações com o conteúdo da plataforma.
                </span>
              </li>
            </ul>
          </section>

          {/* Finalidade */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-green/10">
                <span className="text-lg font-bold text-kid-green">3</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">3. Finalidade do Tratamento</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Os dados pessoais coletados são utilizados exclusivamente para as seguintes finalidades:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Processar e entregar pedidos de produtos digitais e físicos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Enviar comprovantes de compra e informações sobre o status de pedidos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Ativar códigos de acesso ao conteúdo digital adquirido.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Melhorar a experiência do usuário e personalizar o conteúdo oferecido.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Comunicar novidades, promoções e atualizações da plataforma (mediante consentimento).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Cumprir obrigações legais e regulatórias.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Prevenir fraudes e garantir a segurança da plataforma e dos usuários.</span>
              </li>
            </ul>
          </section>

          {/* Compartilhamento */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-purple/10">
                <span className="text-lg font-bold text-kid-purple">4</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">4. Compartilhamento de Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender não vende, aluga ou compartilha seus dados pessoais com terceiros
              para fins comerciais. Seus dados podem ser compartilhados apenas com prestadores de
              serviços essenciais para o funcionamento da plataforma, como gateways de pagamento
              e serviços de e-mail, sempre sob obrigações contratuais de sigilo e em conformidade
              com a LGPD. Dados anonimizados podem ser utilizados para fins estatísticos e de
              melhoria dos serviços, sem possibilidade de identificação do usuário.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-pink/10">
                <span className="text-lg font-bold text-kid-pink">5</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">5. Cookies e Tecnologias Similares</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência na plataforma.
              Os cookies utilizados incluem:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Cookies essenciais:</strong> Necessários para o funcionamento básico da
                  plataforma, como preferências de aceite de termos e sessão do usuário.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Cookies de desempenho:</strong> Coletam informações anônimas sobre como
                  os usuários interagem com a plataforma para melhorar seu desempenho.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Cookies de funcionalidade:</strong> Permitem lembrar preferências do
                  usuário, como itens favoritos e dados de produtos ativados.
                </span>
              </li>
            </ul>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mt-3">
              Você pode configurar seu navegador para recusar cookies, porém isso pode afetar
              a funcionalidade da plataforma.
            </p>
          </section>

          {/* Segurança */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-yellow/10">
                <span className="text-lg font-bold text-kid-orange">6</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">6. Segurança dos Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados
              pessoais contra acesso não autorizado, destruição, perda, alteração ou qualquer
              forma de tratamento inadequado. Estas medidas incluem encriptação de dados em
              trânsito (SSL/TLS), controles de acesso restritos, monitoramento contínuo de
              segurança e backups regulares. Embora empreguemos esforços razoáveis para proteger
              suas informações, nenhum sistema de segurança é completamente infalível, e não
              podemos garantir absoluta segurança dos dados transmitidos pela internet.
            </p>
          </section>

          {/* Direitos do titular */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-teal/10">
                <span className="text-lg font-bold text-kid-teal">7</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">7. Direitos do Titular dos Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Em conformidade com a LGPD, você possui os seguintes direitos em relação aos seus
              dados pessoais:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Confirmação e acesso:</strong> Confirmar a existência e acessar seus dados pessoais.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Correção:</strong> Solicitar a correção de dados incompletos, inexatos ou desatualizados.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar o tratamento adequado de dados desnecessários.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Portabilidade:</strong> Solicitar a portabilidade dos seus dados para outro fornecedor de serviço.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Revogação do consentimento:</strong> Revogar o consentimento previamente concedido a qualquer momento.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Oposição:</strong> Opor-se ao tratamento de dados realizado sem consentimento, caso haja irregularidade.</span>
              </li>
            </ul>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mt-3">
              Para exercer qualquer destes direitos, entre em contato conosco pelos canais
              disponíveis na plataforma. Responderemos sua solicitação no prazo de até 15 dias
              úteis, conforme previsto pela LGPD.
            </p>
          </section>

          {/* Armazenamento */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <span className="text-lg font-bold text-kid-blue">8</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">8. Armazenamento de Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Seus dados pessoais serão armazenados pelo período necessário para cumprir as
              finalidades para as quais foram coletados, incluindo obrigações legais, contratuais,
              de prestação de contas ou de requerimento. Dados de transação serão mantidos por
              prazo mínimo de 5 (cinco) anos para fins fiscais, conforme legislação brasileira.
              Após o término do período de retenção, os dados serão eliminados de forma segura
              ou anonimizados, salvo existência de base legal para sua manutenção.
            </p>
          </section>

          {/* Menores de idade */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-pink/10">
                <span className="text-lg font-bold text-kid-pink">9</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">9. Menores de Idade</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender é voltado para o público infantojuvenil, porém as compras e o
              fornecimento de dados pessoais devem ser realizados por pais, mães ou responsáveis
              legais. Ao fornecer dados de menores, o responsável confirma que possui autoridade
              legal para conceder o consentimento em nome da criança. Reservamo-nos o direito
              de solicitar comprovação de responsabilidade parental quando necessário. Não
              coletamos intencionalmente dados pessoais de menores de idade sem consentimento
              do responsável.
            </p>
          </section>

          {/* Contato */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-green/10">
                <span className="text-lg font-bold text-kid-green">10</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">10. Contato</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Para dúvidas, solicitações ou reclamações relacionadas a esta Política de
              Privacidade ou ao tratamento dos seus dados pessoais, entre em contato com nosso
              Encarregado de Proteção de Dados (DPO) pelos canais disponíveis na plataforma.
              Estamos comprometidos em atender sua solicitação de forma rápida e transparente.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/termos-de-uso"
            className="text-sm text-kid-blue hover:text-kid-blue/70 font-semibold transition-colors"
          >
            Ver Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
}
