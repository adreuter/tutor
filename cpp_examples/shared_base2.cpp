class W { public:
int w; virtual void f(int);
virtual void g(int);
virtual void h(int);
};
class B : public virtual W { public:
int b; void g(int);
};

class D { public:
virtual void f(int); int z;
};

class C : public B, public virtual D { public:
int c; void h(int);
};

int main(int argc, char **argv){
C* pc;
((W*)pc)->h(42);
return 0;
}
