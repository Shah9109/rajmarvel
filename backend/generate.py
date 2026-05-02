ids = """1jTcQzaFooowirVA7qNkKxeVviE4jIhHh
1VeEvto86VQXkRhRsti0CSSVO-9e1796j
1KXw6o2xRhjd7-xl82rbJcx1DIf5tSxDF
1CqX-lpGVBO_Y48Yys4ZJ5LGlDmSulX5p
1yXr8bucwfmwAbwHbdT5Z0dXeXtgYDWm0
1mj7IHADNF6VdC7TdcFQkYvhq9q_M3BHN
1kTT7abE6BXayP88TUCh8C9iWYz2QK_tT
1iwNll_NE2_sJSG3uoVeOUbPTWIrGwIaB
1hOSp8xcQqluQxX-8o4eq-Amw97N5n6uC
1YdTiILg8wuadEShX689A5ujqkWAjj432
1Y-jzxo0OdKZ0wZ-ObX59P2pkcGzQgYeJ
1W-yvOeKgJYgK-yykU1sJxupXCMaJX-KZ
1S5pginmPe1iTvmQhUYDmhazpr00MkqC2
1S4qTHjEs5Ovm7eBwyeJ2EOJMFUsY7SNJ
1PEfV0nM1VVd65L7O4HZLSwmtvgKR5Tkb
1L6-CnPzJMjN3E_FuSW8uB68jQV_4-r73
1KgRU4cUc-KKlg6MZxAuTwqIUmOui0EHe
1JTDedgGD_rmSNF-p69xAC4tFEEvr9VbH
1Hs4xycvEOznVgB5T1Tkzhy_3G19tmidD
1GHfOsqnUAjuf6Rce8PGx3OYP4vbya6os
1GBWhjw5XaMz8lwuBCQdxXg_WFSr0tNxe
1Esfb5vq7J443mQWFf7q-C6nXV1CBVbtr
1AbRtt0TKS6h8L67CWJ9OaLZEkgw_OKjv
169zMFQCnrFCIXyB9HJT-FWacNdx8gGFh
1wlMSQ_-7F-2scuS9qsH_bhBeijFaFGux
1q_9Cv9aUfm3k63qJ7ApO_c3PboIi4MCk
1k9O0tX8nI5n7oxrp2lyXXV_kDfhhGAHp
1aKaEoTr0KuPPjzsVGYldxH5EYDtz3POc
1a680qEq-KtKZD-ssJHr74Ubc0yJ_eHNg
1XeoX8cKnyhER2y_SpNDl6btd3M-Gzf8f
1WjwYu65a1AvVfnNwLkfgRmqV-pGHvwbR
1URFoMAPhWcLdefezAfI2dEYy4YTh4f15
1Sa4X2VHsMSHufggyXe4AVZgndx0DZbAj
1RUfrFhGYxSmi0hfzsjWljUJw1tEVhPhe
1NaDT9U3CH9RFDKEiWNwHMoG9Hn4JPBYt
1LsrMPNuDyLryG5E4PJI6I_Xc-sjAk59g
1FndCOWC_ujD01428Wk97Lnd0wQzDUi-y
1C56HDgAkRrLyeG1aJcck_yCFtr-a8DPg
1B2hq8gfMB9GDOvXIENzFAi1SqLVvLoL9
19dM2OP8X4H9lUgOmdOszmUgpe1wFm6ag
19NGL4cSwjp7bHUMBzH0-IskKg1rgJrAP
15TarrGjj4SUSY0WmR5mJXCRvOAUrpZN-
12zXaYLqPLKLu6U5atrkPHq2Jyaqc0xHs"""

print("  const dummyProjects = [")
for i, line in enumerate(ids.strip().split("\n")):
    print(f"    {{ id: {i+1}, title: 'Portfolio Project {i+1}', category: 'Exterior Design', imageUrl: 'https://drive.google.com/uc?export=view&id={line.strip()}' }},")
print("  ];")
