# key_generation.py
from cryptography.fernet import Fernet

# Generate the encryption key
encryption_key = Fernet.generate_key()

#  Print the key (in bytes)
# print(encryption_key)  # This will include the 'b' prefix, meaning it's in byte format
# Print the key as string (or store it securely) as totp needs string version
print(encryption_key.decode())  # This is the key to store in HashiCorp Vault
