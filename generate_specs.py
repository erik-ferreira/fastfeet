import os

def gerar_arquivos_e2e():
    # Pega o diretório onde o script está sendo executado
    diretorio_atual = os.getcwd()
    
    # Lista todos os arquivos no diretório
    arquivos = os.listdir(diretorio_atual)
    
    arquivos_criados = 0
    
    for arquivo in arquivos:
        # Verifica se o arquivo termina com .controller.ts
        if arquivo.endswith('.controller.ts'):
            # Gera o novo nome substituindo a extensão
            novo_nome = arquivo.replace('.controller.ts', '.controller.e2e-spec.ts')
            caminho_novo_arquivo = os.path.join(diretorio_atual, novo_nome)
            
            # Verifica se o arquivo e2e já existe para não sobrescrever
            if not os.path.exists(caminho_novo_arquivo):
                # Cria um arquivo vazio
                with open(caminho_novo_arquivo, 'w', encoding='utf-8') as f:
                    pass
                print(f"✅ Criado: {novo_nome}")
                arquivos_criados += 1
            else:
                print(f"⚠️ Já existe: {novo_nome} (ignorado)")
                
    if arquivos_criados == 0:
        print("\nNenhum arquivo novo precisou ser criado.")
    else:
        print(f"\nTotal de {arquivos_criados} arquivos criados com sucesso!")

if __name__ == "__main__":
    gerar_arquivos_e2e()